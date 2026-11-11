import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { coinmarketcap } from './index';
import { listingsResponse } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'coinmarketcap', 'default');
	const corsair = createCorsair({
		plugins: [coinmarketcap({ key: 'cmc-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
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

const minuteLimit = {
	status: {
		timestamp: '2026-11-09T15:08:53.298Z',
		error_code: '1008',
		error_message: "You've exceeded your API Key's HTTP request rate limit.",
		elapsed: 0,
		credit_count: 0,
	},
};

const dailyLimit = {
	status: {
		timestamp: '2026-11-09T15:08:53.298Z',
		error_code: '1009',
		error_message: "You've exceeded your API Key's daily rate limit.",
		elapsed: 0,
		credit_count: 0,
	},
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(minuteLimit, 429, { 'Retry-After': '1' });
			respond(listingsResponse);

			const result = await corsair.coinmarketcap.api.cryptocurrency.listings({
				limit: 1,
			});

			expect(result.assets).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after two retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 3; i += 1) {
				respond(minuteLimit, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.coinmarketcap.api.cryptocurrency.map({ limit: 1 }),
			).rejects.toMatchObject({ status: 429, code: 1008 });
			// One attempt plus the two retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a daily credit limit, which no wait can clear', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(dailyLimit, 429);

			await expect(
				corsair.coinmarketcap.api.cryptocurrency.map({ limit: 1 }),
			).rejects.toMatchObject({ status: 429, code: 1009 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					status: {
						timestamp: '2026-11-09T15:08:07.888Z',
						error_code: '400',
						error_message:
							"'limit' should be a positive number in range [1, 5000]",
						elapsed: 0,
						credit_count: 0,
					},
				},
				400,
			);

			await expect(
				corsair.coinmarketcap.api.cryptocurrency.listings({ limit: 1 }),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('pins the no-header delay at the documented 60 second window', async () => {
		// CoinMarketCap does not always send Retry-After, so the handler
		// supplies the window itself. Core sleeps with plain setTimeout, which
		// fake timers can advance.
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(minuteLimit, 429);
			respond(listingsResponse);

			const promise = corsair.coinmarketcap.api.cryptocurrency.listings({
				limit: 1,
			});
			// The first attempt has already failed by the time the handler runs.
			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			// A millisecond short of the window: no second attempt yet.
			await jest.advanceTimersByTimeAsync(59_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
			await expect(promise).resolves.toMatchObject({
				assets: expect.any(Array),
			});
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});
});
