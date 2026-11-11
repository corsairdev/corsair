import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { opengraph } from './index';
import { rateLimitError, siteResponse } from './test-fixtures';

// Endpoint tests call the HTTP client, which makes one attempt
// (rateLimitConfig.maxRetries: 0); only the client corsair binds retries.
// CI skips integration.test.ts, so the 429 path is exercised here.

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'opengraph', 'default');
	const corsair = createCorsair({
		plugins: [opengraph({ key: 'og-test-id' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status: number,
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
	// An unqueued call must fail instead of reaching the network.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unmocked fetch'));
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('OpenGraph.io retry through createCorsair', () => {
	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimitError, 429, { 'Retry-After': '1' });
			respond(siteResponse, 200);

			const result = await corsair.opengraph.api.site.get({
				url: 'https://github.com',
			});

			expect(result.hybridGraph?.site_name).toBe('GitHub');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three rate-limit retries', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i++) {
				respond(rateLimitError, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.opengraph.api.site.get({ url: 'https://github.com' }),
			).rejects.toMatchObject({ status: 429, isRateLimit: true });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});
});
