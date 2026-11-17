import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { tapfiliate } from './index';
import { affiliate, affiliates } from './test-fixtures';

/**
 * `endpoints.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer runs.
 *
 * Reads replay after a 5xx, writes never do: a repeated conversion create pays
 * the affiliate twice, and a repeated payment records a second one.
 */

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'tapfiliate', 'default');
	const corsair = createCorsair({
		plugins: [tapfiliate({ key: 'tap-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
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
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('rate-limit retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '1' });
			respond(affiliates);

			const result = await corsair.tapfiliate.api.affiliates.list({});

			expect(result).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 3 retries, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond({ message: 'Too many requests' }, 429);
			}

			await expect(
				corsair.tapfiliate.api.affiliates.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});

describe('fake-timer delay pinning', () => {
	it('backs off when a 429 carries no Retry-After', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429);
			respond(affiliates);

			// Fake timers start after the client exists, so the database setup
			// never runs on a fake clock.
			jest.useFakeTimers();
			const pending = corsair.tapfiliate.api.affiliates.list({});

			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_000);
			await expect(pending).resolves.toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	}, 30_000);
});

describe('server-error replay safety', () => {
	it('replays a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);
			respond(affiliate);

			const result = await corsair.tapfiliate.api.affiliates.get({
				affiliateId: 'jane-jameson',
			});

			expect(result.id).toBe('jane-jameson');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays a conversion create on 5xx, because it may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);

			await expect(
				corsair.tapfiliate.api.conversions.create({
					click_id: '1-abc',
					amount: 30.55,
				}),
			).rejects.toMatchObject({ status: 500 });

			// Exactly one attempt: a second conversion pays the affiliate twice.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
