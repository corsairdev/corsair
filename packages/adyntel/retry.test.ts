import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { adyntel } from './index';
import { googleShoppingAds, linkedinAdsResponse } from './test-fixtures';

/**
 * `endpoints.test.ts` calls the HTTP client, which is built with
 * `maxRetries: 0` so only `error-handlers.ts` decides what is retried. This
 * file goes through `createCorsair` to prove that layer actually runs: it is
 * the only place a 429 can be retried at all.
 *
 * Only `google.shoppingStatus` is retried. Every other Adyntel call bills a
 * credit per scrape, so replaying one after an unknown outcome would pay twice;
 * the status poll is the one endpoint the docs call free. The tests below cover
 * both sides of that rule.
 */
const EMAIL = 'mike@tyson.com';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'adyntel', 'default');
	const corsair = createCorsair({
		plugins: [adyntel({ key: 'hd-test-key', email: EMAIL })],
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
	it('retries a 429 on the free status poll and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '1' });
			respond(googleShoppingAds);

			const result = await corsair.adyntel.api.google.shoppingStatus({
				id: '12172142-7717-0066-0000-f1e50ca3d579',
			});

			expect(result.ads).toHaveLength(1);
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
				corsair.adyntel.api.google.shoppingStatus({ id: 'x' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not retry a 500 on the status poll beyond the budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// The handler allows 2 retries, so 3 attempts in total.
			for (let i = 0; i < 3; i += 1) {
				respond({ message: 'Server error' }, 500);
			}

			await expect(
				corsair.adyntel.api.google.shoppingStatus({ id: 'x' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('returns the retried status poll rather than the failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server error' }, 500);
			respond(googleShoppingAds);

			const result = await corsair.adyntel.api.google.shoppingStatus({
				id: '12172142-7717-0066-0000-f1e50ca3d579',
			});

			expect(result.ads).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not retry a billed scrape, because a repeat pays twice', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too many requests' }, 429, { 'Retry-After': '1' });

			await expect(
				corsair.adyntel.api.linkedin.ads({ company_domain: 'clay.com' }),
			).rejects.toMatchObject({ status: 429 });
			// Exactly one attempt: the credit for this scrape is already spent.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a billed scrape on a network failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.adyntel.api.linkedin.ads({ company_domain: 'clay.com' }),
			).rejects.toThrow(/fetch failed/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a billed scrape normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(linkedinAdsResponse);

			const result = await corsair.adyntel.api.linkedin.ads({
				company_domain: 'clay.com',
			});

			expect(result.total_ads).toBe(834);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
