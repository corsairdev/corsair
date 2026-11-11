import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { klaviyo } from './index';
import { profilesListResponse, rateLimited } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'klaviyo', 'default');
	const corsair = createCorsair({
		plugins: [klaviyo({ key: 'pk_test' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** A response as Klaviyo sends it: JSON text under `application/vnd.api+json`. */
// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/vnd.api+json', ...headers },
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
	it('retries a 429 on a read and returns the rows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '1' });
			respond(profilesListResponse);

			const result = await corsair.klaviyo.api.profiles.list({});

			expect(result.data).toHaveLength(2);
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

			await expect(corsair.klaviyo.api.lists.list({})).rejects.toMatchObject({
				status: 429,
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on a create', async () => {
		// A POST creates something, and Klaviyo has acted on it by the time it
		// answers 5xx, so a replay could duplicate it.
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ status: 500, code: 'server_error' }] }, 500);

			await expect(
				corsair.klaviyo.api.lists.create({ name: 'Newsletter' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a read', async () => {
		// A GET has no side effect, so a replay is safe and a transient 5xx is
		// worth one.
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ status: 500, code: 'server_error' }] }, 500);
			respond(profilesListResponse);

			const result = await corsair.klaviyo.api.profiles.list({});

			expect(result.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a dropped create', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.klaviyo.api.lists.create({ name: 'Newsletter' }),
			).rejects.toMatchObject({ method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ errors: [{ status: 400, code: 'invalid' }] }, 400);

			await expect(corsair.klaviyo.api.profiles.list({})).rejects.toMatchObject(
				{ status: 400 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
