import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moosend } from './index';
import { invalidKeyEnvelope, mailingList } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moosend', 'default');
	const corsair = createCorsair({
		plugins: [moosend({ key: 'moosend-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON envelopes.
function respond(
	envelope: unknown, // unknown: response bodies are arbitrary JSON envelopes.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(envelope), {
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
	it('retries a gateway 429 on a read and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'throttled' }, 429, {
				'Retry-After': '1',
			});
			respond({ Code: 0, Error: null, Context: [mailingList] });

			const result = await corsair.moosend.api.lists.list({});

			expect(result.mailingLists).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ error: 'throttled' }, 429, { 'Retry-After': '1' });
			}

			await expect(corsair.moosend.api.lists.list({})).rejects.toMatchObject({
				status: 429,
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry the invalid-key envelope', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(invalidKeyEnvelope);

			await expect(corsair.moosend.api.lists.list({})).rejects.toMatchObject({
				code: 104,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a transport failure and succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond({ Code: 0, Error: null, Context: [mailingList] });

			const result = await corsair.moosend.api.lists.list({});

			expect(result.mailingLists).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a subscribe after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'upstream' }, 503);

			await expect(
				corsair.moosend.api.subscribers.subscribe({
					mailingListId: 'list-1',
					email: 'jana@example.com',
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
