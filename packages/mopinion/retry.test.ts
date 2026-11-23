import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mopinion } from './index';
import { account, invalidCredentialsProblem } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mopinion', 'default');
	const corsair = createCorsair({
		plugins: [
			mopinion({ publicKey: 'pub-test-1', signatureToken: 'sig-test-1' }),
		],
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
			respond({ title: 'throttled' }, 429, { 'Retry-After': '1' });
			respond({ data: [account], _meta: { code: 200 } });

			const result = await corsair.mopinion.api.account.get({});

			expect(result.data).toEqual([account]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the throttle', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ title: 'throttled' }, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.mopinion.api.deployments.list({}),
			).rejects.toMatchObject({ status: 429 });
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry the RFC 7807 invalid-credentials 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(invalidCredentialsProblem, 401, {
				'Content-Type': 'application/problem+json',
			});

			await expect(corsair.mopinion.api.account.get({})).rejects.toMatchObject({
				status: 401,
				errorCode: 18,
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
			respond({ data: [], _meta: { code: 200 } });

			const result = await corsair.mopinion.api.deployments.list({});

			expect(result.data).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
