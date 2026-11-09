import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { dropcontact } from './index';
import {
	creditsResponse,
	enrichAccepted,
	rateLimited,
	resultsNotReady,
	resultsReady,
} from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'dropcontact', 'default');
	const corsair = createCorsair({
		plugins: [dropcontact({ key: 'dc-test-key' })],
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
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the balance', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '1' });
			respond(creditsResponse);

			const result = await corsair.dropcontact.api.account.credits({});

			expect(result.credits).toBe(15277);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(rateLimited, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.dropcontact.api.account.credits({}),
			).rejects.toMatchObject({ status: 429 });
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on the write route too, and returns the request id', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'An error occurred. Please retry later.' }, 500);
			respond(enrichAccepted);

			const result = await corsair.dropcontact.api.enrichment.enrich({
				data: [{ email: 'dc@dropcontact.io' }],
			});

			expect(result.request_id).toBe('qzmxkpvlrtdnhwa');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a dropped write, because it may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.dropcontact.api.enrichment.enrich({
					data: [{ email: 'dc@dropcontact.io' }],
				}),
			).rejects.toMatchObject({ method: 'POST' });
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
					error: true,
					success: false,
					reason: 'Too many records, you can only submit up to 250 records',
				},
				400,
			);

			await expect(
				corsair.dropcontact.api.enrichment.enrich({
					data: [{ email: 'dc@dropcontact.io' }],
				}),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a not-ready result, which is not an error', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(resultsNotReady);

			const result = await corsair.dropcontact.api.enrichment.results({
				request_id: 'qzmxkpvlrtdnhwa',
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe('in_progress');
			// One request: a poll loop belongs to the caller, not the client.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns the enriched records on the next poll', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(resultsNotReady);
			respond(resultsReady);

			const first = await corsair.dropcontact.api.enrichment.results({
				request_id: 'qzmxkpvlrtdnhwa',
			});
			expect(first.success).toBe(false);

			const second = await corsair.dropcontact.api.enrichment.results({
				request_id: 'qzmxkpvlrtdnhwa',
			});
			expect(second.success).toBe(true);
			expect(second.records).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
