import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { heyy } from './index';
import {
	contactsSearchEmpty,
	contactsSearchResponse,
	rateLimited,
} from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'heyy', 'default');
	const corsair = createCorsair({
		plugins: [heyy({ key: 'heyy-test-key' })],
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

describe('retries through the bound client', () => {
	it('retries a 429 on a search and returns the rows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '1' });
			respond(contactsSearchResponse);

			const result = await corsair.heyy.api.contacts.search({});

			expect(result.contacts).toHaveLength(2);
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

			await expect(corsair.heyy.api.labels.search({})).rejects.toMatchObject({
				status: 429,
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a search', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, error: { messageKey: 'internal_error' } }, 500);
			respond(contactsSearchEmpty);

			const result = await corsair.heyy.api.contacts.search({});

			expect(result.contacts).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a dropped POST, which may have created a row', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.heyy.api.contacts.create({ email: 'a@b.co' }),
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
					success: false,
					error: { messageKey: 'invalid_params', message: 'Bad request.' },
				},
				400,
			);

			await expect(corsair.heyy.api.contacts.search({})).rejects.toMatchObject({
				status: 400,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
