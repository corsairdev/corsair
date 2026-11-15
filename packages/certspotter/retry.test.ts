import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { certspotter } from './index';
import { issuancePage } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried.
 *
 * Cert Spotter documents that an `internal_error` may be retried with
 * exponential backoff, and both routes are GETs, so every replay here is safe.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'certspotter', 'default');
	const corsair = createCorsair({
		plugins: [certspotter({ key: 'cs-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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

describe('retries through createCorsair', () => {
	it('retries a rate_limited 429 and returns the next page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'rate_limited', message: 'slow down' }, 429, {
				'Retry-After': '1',
			});
			respond(issuancePage);

			const result = await corsair.certspotter.api.issuances.list({
				domain: 'example.com',
			});

			expect(result).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ code: 'rate_limited' }, 429);
			}

			await expect(
				corsair.certspotter.api.issuances.list({ domain: 'example.com' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a 503, which the provider says is safe with backoff', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'service_outage', message: 'high load' }, 503);
			respond(issuancePage);

			const result = await corsair.certspotter.api.issuances.list({
				domain: 'example.com',
			});

			expect(result).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a query timeout, which no replay fixes', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'timeout', message: 'exceeded the time limit' }, 400);

			await expect(
				corsair.certspotter.api.issuances.list({ domain: 'example.com' }),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'bad_credentials', message: 'Invalid API key' }, 401);

			await expect(
				corsair.certspotter.api.issuances.list({ domain: 'example.com' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'rate_limited' }, 429, { 'Retry-After': '2' });
			respond(issuancePage);

			const pending = corsair.certspotter.api.issuances.list({
				domain: 'example.com',
			});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the strategy delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 'rate_limited' }, 429);
			respond(issuancePage);

			const pending = corsair.certspotter.api.issuances.list({
				domain: 'example.com',
			});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
