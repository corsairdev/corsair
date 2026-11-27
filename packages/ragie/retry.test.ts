import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ragie } from './index';
import { documentsList, retrieval, tooManyRequests } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer actually runs.
 *
 * No write here is documented idempotent, so every replay test uses a read.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'ragie', 'default');
	const corsair = createCorsair({
		plugins: [ragie({ key: 'ragie-test-key' })],
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
	it('retries a 429 on documents.list and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(tooManyRequests, 429, { 'Retry-After': '1' });
			respond(documentsList);

			const result = await corsair.ragie.api.documents.list({});

			expect(result.documents).toHaveLength(2);
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
				respond(tooManyRequests, 429);
			}

			await expect(corsair.ragie.api.documents.list({})).rejects.toMatchObject({
				status: 429,
			});
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('waits for the Retry-After header delay before the second attempt', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(tooManyRequests, 429, { 'Retry-After': '4' });
			respond(documentsList);

			let settled = false;
			const run = corsair.ragie.api.documents.list({}).finally(() => {
				settled = true;
			});
			// The first attempt runs, then the clock must cross the 4 second
			// header delay before the retry fires.
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(3_900);
			expect(settled).toBe(false);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await run;

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('falls back to the exponential delay when no header is sent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(tooManyRequests, 429);
			respond(documentsList);

			let settled = false;
			const run = corsair.ragie.api.documents.list({}).finally(() => {
				settled = true;
			});
			await Promise.resolve();
			// The no-header fallback is exponential, first step one second.
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await run;

			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 500, because no write here is idempotent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'internal error' }, 500);

			await expect(
				corsair.ragie.api.connections.sync({
					connection_id: 'f83f5c92-1fae-4a37-8f3e-23914e2b9c1d',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read after a 500 and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'internal error' }, 500);
			respond(retrieval);

			const result = await corsair.ragie.api.retrievals.retrieve({
				query: 'refund window',
			});

			expect(result.scored_chunks).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not retry a 402 plan limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Plan limit reached or payment required' }, 402);

			await expect(
				corsair.ragie.api.responses.create({ input: 'Summarize' }),
			).rejects.toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
