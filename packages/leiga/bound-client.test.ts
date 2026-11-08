import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { clearLeigaTokenCache } from './client';
import { leiga } from './index';
import { projectListResponse, tokenResponse } from './test-fixtures';
import {
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

/**
 * These drive the **real** account key manager rather than a fixture. Greptile
 * flagged the earlier tests for supplying `get_integration_credentials`, a
 * method the runtime never creates for an `api_key` account. Only a bound client
 * can prove the key builder resolves credentials the manager actually exposes.
 */
beforeEach(() => {
	installFetchMock();
	clearLeigaTokenCache();
});
afterEach(restoreFetchMock);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'leiga', 'default');
	const corsair = createCorsair({
		plugins: [leiga()],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

describe('Leiga bound client without an explicit key', () => {
	it('exchanges a stored client pair and calls the API', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');

			mockFetch(jsonResponse(tokenResponse));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));

			const result = await corsair.leiga.api.projects.list({});

			expect(result.projects).toHaveLength(1);
			// Two calls: the exchange, then the resource.
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('persists the token and its expiry, then reuses them', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');

			mockFetch(jsonResponse(tokenResponse));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			expect(await corsair.leiga.keys.get_access_token()).toBe(
				'test-access-token',
			);
			// The expiry must be stored too, or the next process treats the token
			// as permanently valid and never exchanges again.
			const expiresAt = Number(await corsair.leiga.keys.get_expires_at());
			expect(Number.isFinite(expiresAt)).toBe(true);
			expect(expiresAt).toBeGreaterThan(Date.now());

			// A second call reuses the stored token: no third fetch for a token.
			clearLeigaTokenCache();
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('re-exchanges once the stored token has expired', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');
			// A token that already expired, as a later process would find.
			await corsair.leiga.keys.set_access_token('stale-token');
			await corsair.leiga.keys.set_expires_at(String(Date.now() - 60_000));

			mockFetch(jsonResponse(tokenResponse));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));

			await corsair.leiga.api.projects.list({});

			// The exchange happened again rather than sending the stale token.
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(2);
			expect(await corsair.leiga.keys.get_access_token()).toBe(
				'test-access-token',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('throws AuthMissingError when no pair is stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(corsair.leiga.api.projects.list({})).rejects.toThrow(
				/leiga/i,
			);
			// Nothing was sent: the failure happened before any request.
			expect(jest.mocked(globalThis.fetch)).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('uses an explicit key without exchanging anything', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'leiga', 'default');
		const corsair = createCorsair({
			plugins: [leiga({ key: 'explicit-token' })],
			database: testDb.db,
			kek: KEK,
		});
		try {
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));

			await corsair.leiga.api.projects.list({});

			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(1);
			const [, init] = jest.mocked(globalThis.fetch).mock.calls[0]!;
			expect(new Headers(init?.headers).get('accessToken')).toBe(
				'explicit-token',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
