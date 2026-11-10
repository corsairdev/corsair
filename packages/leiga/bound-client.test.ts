import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import {
	decodeLeigaStoredToken,
	encodeLeigaStoredToken,
	fingerprintLeigaPair,
} from './auth';
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

/** A token exchange answer carrying the given token, valid for seven days. */
function tokenFor(accessToken: string) {
	return { code: '0', data: { expireIn: 604800, accessToken } };
}

/** The `accessToken` header of the nth fetch call, from zero. */
function sentToken(call: number): string | null {
	const init = jest.mocked(globalThis.fetch).mock.calls[call]?.[1];
	return new Headers(init?.headers).get('accessToken');
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

			const stored = decodeLeigaStoredToken(
				await corsair.leiga.keys.get_access_token(),
			);
			expect(stored?.accessToken).toBe('test-access-token');
			// The expiry must be stored too, or the next process treats the token
			// as permanently valid and never exchanges again.
			expect(stored?.expiresAt).toBeGreaterThan(Date.now());
			// And the pair, so a token cannot outlive the pair that minted it.
			expect(stored?.pair).toBe(fingerprintLeigaPair('cid', 'secret'));

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
			await corsair.leiga.keys.set_access_token(
				encodeLeigaStoredToken({
					accessToken: 'stale-token',
					expiresAt: Date.now() - 60_000,
					pair: fingerprintLeigaPair('cid', 'secret'),
				}),
			);

			mockFetch(jsonResponse(tokenResponse));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));

			await corsair.leiga.api.projects.list({});

			// The exchange happened again rather than sending the stale token.
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(2);
			expect(sentToken(1)).toBe('test-access-token');
			expect(
				decodeLeigaStoredToken(await corsair.leiga.keys.get_access_token())
					?.accessToken,
			).toBe('test-access-token');
		} finally {
			testDb.cleanup();
		}
	});

	it('exchanges again when the client pair is replaced', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid-a');
			await corsair.leiga.keys.set_client_secret('secret-a');
			mockFetch(jsonResponse(tokenFor('token-a')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			// The account now points at another Leiga organization.
			await corsair.leiga.keys.set_client_id('cid-b');
			await corsair.leiga.keys.set_client_secret('secret-b');
			clearLeigaTokenCache();
			mockFetch(jsonResponse(tokenFor('token-b')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			const calls = jest.mocked(globalThis.fetch).mock.calls;
			expect(calls).toHaveLength(4);
			expect(String(calls[2]![0])).toContain('/authorize/access-token');
			expect(JSON.parse(String(calls[2]![1]?.body))).toEqual({
				clientId: 'cid-b',
				secretKey: 'secret-b',
			});
			// The token minted for the first pair is never sent again.
			expect(sentToken(3)).toBe('token-b');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not send a stored token once the client pair is gone', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');
			mockFetch(jsonResponse(tokenFor('token-a')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			await corsair.leiga.keys.set_client_id('');
			await corsair.leiga.keys.set_client_secret('');
			clearLeigaTokenCache();

			await expect(corsair.leiga.api.projects.list({})).rejects.toThrow(
				/leiga/i,
			);
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replaces a token Leiga rejects and repeats the call', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');
			mockFetch(jsonResponse(tokenFor('token-a')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			// Leiga stops accepting the stored token before its recorded expiry.
			mockFetch(jsonResponse({ code: '15', msg: 'accessToken error' }));
			mockFetch(jsonResponse(tokenFor('token-b')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));

			const result = await corsair.leiga.api.projects.list({});

			expect(result.projects).toHaveLength(1);
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(5);
			expect(sentToken(2)).toBe('token-a');
			expect(sentToken(4)).toBe('token-b');

			// The replacement is stored: the next call sends it with no exchange.
			clearLeigaTokenCache();
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(6);
			expect(sentToken(5)).toBe('token-b');
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after one replacement when Leiga still rejects the token', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');
			mockFetch(jsonResponse(tokenFor('token-a')));
			mockFetch(jsonResponse({ code: '15', msg: 'accessToken error' }));
			mockFetch(jsonResponse(tokenFor('token-b')));
			mockFetch(jsonResponse({ code: '15', msg: 'accessToken error' }));

			await expect(corsair.leiga.api.projects.list({})).rejects.toThrow(
				/code 15/,
			);
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not keep an expired token when saving its replacement fails', async () => {
		const { corsair, testDb } = await createClient();
		const realNow = Date.now();
		const clock = jest.spyOn(Date, 'now').mockReturnValue(realNow);
		try {
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');
			mockFetch(jsonResponse(tokenFor('token-a')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			// Eight days on, past the seven day lifetime of token-a.
			clock.mockReturnValue(realNow + 8 * 86_400_000);
			clearLeigaTokenCache();
			jest
				.spyOn(corsair.leiga.keys, 'set_access_token')
				.mockRejectedValueOnce(new Error('database unavailable'));
			mockFetch(jsonResponse(tokenFor('token-b')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});
			expect(sentToken(3)).toBe('token-b');
			// Account writes run one after another, so this one returns only
			// after anything the call above left in flight has landed.
			await corsair.leiga.keys.set_client_id('cid');

			// Nothing usable was saved, so the next process exchanges again
			// rather than sending the expired token-a with a fresh expiry.
			clearLeigaTokenCache();
			mockFetch(jsonResponse(tokenFor('token-c')));
			mockFetch(jsonResponse({ code: '0', data: projectListResponse }));
			await corsair.leiga.api.projects.list({});

			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(6);
			expect(sentToken(5)).toBe('token-c');
		} finally {
			clock.mockRestore();
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

	it('does not replace an explicit key that Leiga rejects', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'leiga', 'default');
		const corsair = createCorsair({
			plugins: [leiga({ key: 'explicit-token' })],
			database: testDb.db,
			kek: KEK,
		});
		try {
			// A pair is stored too, but the caller chose their own token.
			await corsair.leiga.keys.issue_new_dek();
			await corsair.leiga.keys.set_client_id('cid');
			await corsair.leiga.keys.set_client_secret('secret');
			mockFetch(jsonResponse({ code: '15', msg: 'accessToken error' }));

			await expect(corsair.leiga.api.projects.list({})).rejects.toThrow(
				/code 15/,
			);
			expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(1);
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
