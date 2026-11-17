import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twelvedata } from './index';
import { price, quote, rsiSeries } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried.
 *
 * The free plan allows 8 requests a minute, so the tests here queue their
 * responses rather than waiting on the real limit.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'twelvedata', 'default');
	const corsair = createCorsair({
		plugins: [twelvedata({ key: 'td-test-key' })],
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
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 429, message: 'too many' }, 429, { 'Retry-After': '1' });
			respond(price);

			const result = await corsair.twelvedata.api.market.price({
				symbol: 'AAPL',
			});

			expect(result.price).toBe('211.66000');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({}, 429);
			}

			await expect(
				corsair.twelvedata.api.market.price({ symbol: 'AAPL' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a 5xx, since every route is a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond(rsiSeries);

			const result = await corsair.twelvedata.api.indicators.rsi({
				symbol: 'AAPL',
				interval: '1day',
			});

			expect(result.values).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 401, message: 'apikey incorrect' }, 401);

			await expect(
				corsair.twelvedata.api.market.price({ symbol: 'AAPL' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 200 body that said error', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ code: 400, message: 'symbol not found', status: 'error' });

			await expect(
				corsair.twelvedata.api.market.quote({ symbol: 'NOPE' }),
			).rejects.toThrow(/market.quote/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a quote normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(quote);

			const result = await corsair.twelvedata.api.market.quote({
				symbol: 'AAPL',
			});

			expect(result.close).toBe('211.00');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '2' });
			respond(price);

			const pending = corsair.twelvedata.api.market.price({ symbol: 'AAPL' });
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({ price: '211.66000' });
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
			respond({}, 429);
			respond(price);

			const pending = corsair.twelvedata.api.market.price({ symbol: 'AAPL' });
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({ price: '211.66000' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
