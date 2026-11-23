import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moco } from './index';
import { mocoUser, unauthorized } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moco', 'default');
	const corsair = createCorsair({
		plugins: [moco({ key: 'moco-test-key', subdomain: 'beachy' })],
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
			respond({ message: 'Too many requests' }, 429, {
				'Retry-After': '1',
			});
			respond([mocoUser]);

			const result = await corsair.moco.api.users.list({});

			expect(result.items).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the rate limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ message: 'Too many requests' }, 429, {
					'Retry-After': '1',
				});
			}

			await expect(corsair.moco.api.users.list({})).rejects.toMatchObject({
				status: 429,
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401 auth failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(unauthorized, 401);

			await expect(corsair.moco.api.session.verify({})).rejects.toMatchObject({
				status: 401,
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
			respond([mocoUser]);

			const result = await corsair.moco.api.users.list({});

			expect(result.items).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'upstream unavailable' }, 503);

			await expect(
				corsair.moco.api.companies.create({ name: 'Beachy' }),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
