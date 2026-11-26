import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { GiteaPluginOptions } from './index';
import { gitea } from './index';
import {
	errorEnvelope,
	repoFixture,
	userFixture,
} from './test-fixtures';

const INSTANCE = 'https://git.example.com';
const KEK = '0123456789abcdef0123456789abcdef';

/**
 * The endpoint-level suites call the HTTP client, whose rate-limit config has
 * `maxRetries: 0`, so only error-handlers.ts decides what is retried. This
 * file goes through `createCorsair` to prove that layer actually runs.
 *
 * Reads (repos.get) are the only things replayed: writes stay down after a
 * 5xx or a dropped connection, because a retried issue create duplicates the
 * issue.
 */
async function createClient(options: GiteaPluginOptions) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'gitea', 'default');
	const corsair = createCorsair({
		plugins: [gitea(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? KEK,
	});
	// The account row starts without a DEK; issuing one lets the key manager
	// store and read credentials the way a connected account does.
	await corsair.gitea.keys.issue_new_dek();
	return { corsair, testDb };
}

/** Stores the key and instance URL on the account, as the connect flow does. */
async function storeAccountCredentials(
	corsair: Awaited<ReturnType<typeof createClient>>['corsair'],
) {
	await corsair.gitea.keys.set_api_key('stored-gitea-token');
	await corsair.gitea.keys.set_instance_url(INSTANCE);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers step
 * over the wait instead of taking it. The rejection handler is attached
 * before the clock moves: otherwise the promise rejects mid-step with nothing
 * listening, and Node reports an unhandled rejection instead of the
 * assertion the test wants.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	tracked.catch(() => undefined);
	for (let step = 0; step < 40 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(60_000);
	}
	return tracked;
}

describe('retry behaviour through createCorsair', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'gt-test-token',
			instanceUrl: INSTANCE,
		});
		try {
			respond(errorEnvelope('Too many requests'), 429, {
				'retry-after': '1',
			});
			respond(repoFixture);

			const result = await withFakeTimers(
				corsair.gitea.api.repos.get({ owner: 'gitea', repo: 'gitea' }),
			);

			expect(result.full_name).toBe('gitea/gitea');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the 60s fallback on a 429 that carries no retry-after header', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'gt-test-token',
			instanceUrl: INSTANCE,
		});
		try {
			respond(errorEnvelope('Too many requests'), 429);
			respond(repoFixture);

			const run = corsair.gitea.api.repos.get({
				owner: 'gitea',
				repo: 'gitea',
			});
			run.catch(() => undefined);
			// The retry fires only after the full 60s fallback, not the default
			// 1s: at 59.999s there is still exactly one attempt.
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(59_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);

			const result = await run;
			expect(result.full_name).toBe('gitea/gitea');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the handler budget of three retries', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'gt-test-token',
			instanceUrl: INSTANCE,
		});
		try {
			// The handler allows 3 retries, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond(errorEnvelope('Too many requests'), 429);
			}

			await expect(
				withFakeTimers(
					corsair.gitea.api.repos.get({ owner: 'gitea', repo: 'gitea' }),
				),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx but never a write', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'gt-test-token',
			instanceUrl: INSTANCE,
		});
		try {
			// The read gets a 500 and then succeeds on the retry.
			respond(errorEnvelope('server error'), 500);
			respond(repoFixture);
			const result = await withFakeTimers(
				corsair.gitea.api.repos.get({ owner: 'gitea', repo: 'gitea' }),
			);
			expect(result.full_name).toBe('gitea/gitea');
			expect(fetchMock).toHaveBeenCalledTimes(2);

			// The write gets one 500 and stops: a retried create could
			// duplicate the issue.
			respond(errorEnvelope('server error'), 500);
			await expect(
				withFakeTimers(
					corsair.gitea.api.issues.create({
						owner: 'gitea',
						repo: 'gitea',
						title: 'Duplicated?',
					}),
				),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a dropped connection', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'gt-test-token',
			instanceUrl: INSTANCE,
		});
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(repoFixture);

			const result = await withFakeTimers(
				corsair.gitea.api.repos.get({ owner: 'gitea', repo: 'gitea' }),
			);
			expect(result.full_name).toBe('gitea/gitea');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('binds a client with no explicit key from the stored account credentials', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await storeAccountCredentials(corsair);
			respond(userFixture);

			await withFakeTimers(corsair.gitea.api.user.me({}));

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(String(url)).toBe(`${INSTANCE}/api/v1/user`);
			expect(new Headers(init.headers).get('authorization')).toBe(
				'token stored-gitea-token',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
