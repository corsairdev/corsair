import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { segment } from './index';
import { PAGINATION, SOURCE, paginated } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer actually runs.
 *
 * Every read here (workspace, sources.list) is replay-safe; a failed write
 * (sources.createWriteKey, which mints a credential) must never replay.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'segment', 'default');
	const corsair = createCorsair({
		plugins: [segment({ key: 'sst-test-token' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
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
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
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
			respond(
				{
					errors: [{ type: 'RateLimited', message: 'Rate limit exceeded' }],
				},
				429,
				{ 'Retry-After': '1' },
			);
			respond(paginated([SOURCE], 'sources'));

			const result = await corsair.segment.api.sources.list({ count: 5 });

			expect(result.data.sources).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 3 retries, so 4 attempts in total.
			for (let i = 0; i < 4; i += 1) {
				respond({ errors: [{ type: 'RateLimited', message: 'Rate limit exceeded' }] }, 429);
			}

			await expect(
				corsair.segment.api.sources.list({ count: 5 }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('returns a read after a 5xx once the retry succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The SERVER_ERROR handler allows 2 retries, so 3 attempts.
			respond({ errors: [{ type: 'Internal', message: 'boom' }] }, 500);
			respond(paginated([SOURCE], 'sources'));

			const result = await corsair.segment.api.sources.list({ count: 5 });

			expect(result.data.pagination).toEqual(PAGINATION);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays the write-key create on a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ type: 'Internal', message: 'boom' }] }, 500);

			await expect(
				corsair.segment.api.sources.createWriteKey({ sourceId: 'qQ1' }),
			).rejects.toMatchObject({ status: 500 });
			// Exactly one attempt: a replayed credential mint is not safe.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a regulation create on a network failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.segment.api.regulations.create({
					regulationType: 'DELETE_ONLY',
					subjectType: 'USER_ID',
					subjectIds: ['user_123'],
				}),
			).rejects.toThrow(/fetch failed/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad token', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					errors: [
						{ type: 'forbidden', message: 'Not authorized to perform this operation' },
					],
				},
				403,
			);

			await expect(
				corsair.segment.api.workspaces.get({}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('the no-header rate-limit delay', () => {
	it('waits the fallback delay when a 429 has no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			// Token-level 429s always carry Retry-After; a per-endpoint one
			// falls back to the body's msBeforeNext, read by the client.
			respond(
				{
					errors: [{ type: 'RateLimited', message: 'Rate limit exceeded' }],
					data: { msBeforeNext: 2500 },
				},
				429,
			);
			respond(paginated([SOURCE], 'sources'));

			const pending = corsair.segment.api.sources.list({ count: 5 });
			// First attempt, then the Retry-After delay, then the retry.
			await jest.advanceTimersByTimeAsync(2500);
			const result = await pending;
			expect(result.data.sources).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
