import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mopinion } from './index';
import {
	account,
	invalidCredentialsProblem,
	serverProblem,
} from './test-fixtures';

/**
 * Core's request() retries a 429 itself; the bound client then applies this
 * plugin's error handlers (a 5xx read is retried, a 401 is not). This file
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
			respond(account);

			const result = await corsair.mopinion.api.account.get({});

			expect(result.name).toBe(account.name);
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
			// One attempt plus core's three 429 retries; the handler adds none.
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
				message: 'Mopinion 401 18: The credentials you provided are not valid',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read after a 5xx and succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverProblem, 500, {
				'Content-Type': 'application/problem+json',
			});
			respond({ data: [], _meta: { code: 200 } });

			const result = await corsair.mopinion.api.deployments.list({});

			expect(result.data).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
