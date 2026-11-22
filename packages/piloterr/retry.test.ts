import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { piloterr } from './index';
import { googleSearch, rateLimited, usage } from './test-fixtures';

/**
 * Piloterr answers rate limits as 401 with a "Rate limit exceeded…"
 * message rather than 429; the plugin's RATE_LIMIT_ERROR handler retries
 * those with backoff. 5xx replays are safe: every operation is a GET.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'piloterr', 'default');
	const corsair = createCorsair({
		plugins: [piloterr({ key: 'pt-test-key' })],
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
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
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

describe('retries through createCorsair', () => {
	it('retries a 401 rate-limit answer, which Piloterr uses instead of 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 401);
			respond(googleSearch);

			await expect(
				corsair.piloterr.api.google.search({ query: 'test' }),
			).resolves.toMatchObject({
				organic_results: googleSearch.organic_results,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 15000);

	it('replays a failed GET on a 500 with backoff, as the docs prescribe', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Internal Error' }, 500);
			respond(usage);

			await expect(
				corsair.piloterr.api.account.usage({}),
			).resolves.toMatchObject({ remaining: usage.remaining });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 15000);

	it('never retries an auth 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Invalid API Key' }, 401);

			await expect(corsair.piloterr.api.account.usage({})).rejects.toThrow(
				'Piloterr 401: Invalid API Key',
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a 402 payment-required answer', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Payment required' }, 402);

			await expect(
				corsair.piloterr.api.google.search({ query: 'test' }),
			).rejects.toThrow('Piloterr 402');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
