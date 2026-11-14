import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import type { SquarePluginOptions } from './index';
import { square } from './index';
import type { SentRequest } from './test-fixtures';
import {
	BASE,
	jsonBody,
	jsonResponse,
	mockFetch,
	SANDBOX_BASE,
	sentRequest,
	TOKEN,
} from './test-fixtures';

const KEK = '0123456789abcdef0123456789abcdef';
const OLD = 'EAAA-old-access-token';
const NEW = 'EAAA-refreshed-access-token';
const NEXT = 'EAAA-second-refreshed-token';
const REFRESH_TOKEN = 'EQAA-refresh-token';

const unauthorized = {
	errors: [
		{
			category: 'AUTHENTICATION_ERROR',
			code: 'UNAUTHORIZED',
			detail: 'The `Authorization` http header is malformed.',
		},
	],
};

// What Square's ObtainToken answers to a refresh_token grant. It carries
// `expires_at` (a date), not `expires_in`.
const refreshed = (accessToken: string) => ({
	access_token: accessToken,
	token_type: 'bearer',
	expires_at: '2099-01-01T00:00:00Z',
	merchant_id: 'MERCHANT1',
	refresh_token: REFRESH_TOKEN,
});

const nowSeconds = () => Math.floor(Date.now() / 1000);

type Seed = {
	options?: SquarePluginOptions;
	/** Unix seconds; default: valid for another 50 minutes. */
	expiresAt?: number;
};

async function createOAuthClient({ options = {}, expiresAt }: Seed = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'square', 'default');
	const corsair = createCorsair({
		plugins: [square({ authType: 'oauth_2', ...options })],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.keys.square.issue_new_dek();
	await corsair.keys.square.set_client_id('square-app-id');
	await corsair.keys.square.set_client_secret('square-app-secret');
	await corsair.square.keys.issue_new_dek();
	await corsair.square.keys.set_access_token(OLD);
	await corsair.square.keys.set_refresh_token(REFRESH_TOKEN);
	await corsair.square.keys.set_expires_at(
		String(expiresAt ?? nowSeconds() + 3000),
	);
	return { corsair, testDb };
}

/** An account with no token stored at all. */
async function createEmptyClient(authType: 'api_key' | 'oauth_2') {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'square', 'default');
	const corsair = createCorsair({
		plugins: [square({ authType })],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.keys.square.issue_new_dek();
	await corsair.square.keys.issue_new_dek();
	return { corsair, testDb };
}

async function createApiKeyClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'square', 'default');
	const corsair = createCorsair({
		plugins: [square({ authType: 'api_key' })],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.square.keys.issue_new_dek();
	await corsair.square.keys.set_api_key(TOKEN);
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = mockFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

/** Every fetch call made so far, in order. */
function sent(): SentRequest[] {
	return fetchMock.mock.calls.map((_, i) => sentRequest(fetchMock, i));
}

const isTokenCall = (r: SentRequest) => r.pathname === '/oauth2/token';
const bearer = (r: SentRequest) => r.headers.get('authorization');

describe('Square auth: a missing credential', () => {
	it('throws AuthMissingError for api_key and sends nothing', async () => {
		const { corsair, testDb } = await createEmptyClient('api_key');
		try {
			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{ name: 'AuthMissingError', pluginId: 'square', authType: 'api_key' },
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('throws AuthMissingError for oauth_2 and sends nothing', async () => {
		const { corsair, testDb } = await createEmptyClient('oauth_2');
		try {
			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{ name: 'AuthMissingError', pluginId: 'square', authType: 'oauth_2' },
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Square auth: OAuth refresh', () => {
	it('sends the stored token while it is valid, without refreshing', async () => {
		const { corsair, testDb } = await createOAuthClient();
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			await corsair.square.api.locations.list({});

			expect(sent()).toHaveLength(1);
			expect(bearer(sent()[0] as SentRequest)).toBe(`Bearer ${OLD}`);
		} finally {
			testDb.cleanup();
		}
	});

	it('refreshes an expired token before the call, with a JSON body', async () => {
		const { corsair, testDb } = await createOAuthClient({
			expiresAt: nowSeconds() - 60,
		});
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(refreshed(NEW)))
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			await corsair.square.api.locations.list({});

			const [token, api] = sent() as [SentRequest, SentRequest];
			expect(token.method).toBe('POST');
			expect(token.origin + token.pathname).toBe(`${BASE}/oauth2/token`);
			expect(token.headers.get('content-type')).toBe('application/json');
			expect(JSON.parse(String(token.body))).toEqual({
				grant_type: 'refresh_token',
				refresh_token: REFRESH_TOKEN,
				client_id: 'square-app-id',
				client_secret: 'square-app-secret',
			});
			expect(api.pathname).toBe('/v2/locations');
			expect(bearer(api)).toBe(`Bearer ${NEW}`);
		} finally {
			testDb.cleanup();
		}
	});

	it('refreshes against the sandbox host when environment is sandbox', async () => {
		const { corsair, testDb } = await createOAuthClient({
			options: { environment: 'sandbox' },
			expiresAt: nowSeconds() - 60,
		});
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(refreshed(NEW)))
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			await corsair.square.api.locations.list({});

			const [token, api] = sent() as [SentRequest, SentRequest];
			expect(token.origin + token.pathname).toBe(
				`${SANDBOX_BASE}/oauth2/token`,
			);
			expect(api.origin).toBe(SANDBOX_BASE);
		} finally {
			testDb.cleanup();
		}
	});

	it('refreshes after a 401 and sends the request again with the new token', async () => {
		const { corsair, testDb } = await createOAuthClient();
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
				.mockResolvedValueOnce(jsonResponse(refreshed(NEW)))
				.mockResolvedValueOnce(jsonResponse({ locations: [{ id: 'L1' }] }));

			await expect(corsair.square.api.locations.list({})).resolves.toEqual({
				locations: [{ id: 'L1' }],
			});

			const calls = sent();
			expect(calls.filter((r) => !isTokenCall(r))).toHaveLength(2);
			expect(calls.filter(isTokenCall)).toHaveLength(1);
			expect(calls.map(bearer)).toEqual([
				`Bearer ${OLD}`,
				null,
				`Bearer ${NEW}`,
			]);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends a keyless POST again after a 401: it was rejected, not run', async () => {
		const { corsair, testDb } = await createOAuthClient();
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
				.mockResolvedValueOnce(jsonResponse(refreshed(NEW)))
				.mockResolvedValueOnce(jsonResponse({ customer: { id: 'C1' } }));

			await corsair.square.api.customers.create({ given_name: 'Ada' });

			const [first, , second] = sent() as [
				SentRequest,
				SentRequest,
				SentRequest,
			];
			expect(first.pathname).toBe('/v2/customers');
			expect(second.pathname).toBe('/v2/customers');
			expect(jsonBody(second)).toEqual(jsonBody(first));
			expect(bearer(second)).toBe(`Bearer ${NEW}`);
		} finally {
			testDb.cleanup();
		}
	});

	it('stops after one refresh when the new token is rejected too', async () => {
		const { corsair, testDb } = await createOAuthClient();
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
				.mockResolvedValueOnce(jsonResponse(refreshed(NEW)))
				.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
				// A third API call or a second refresh would take these.
				.mockResolvedValueOnce(jsonResponse(refreshed(NEXT)))
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{ name: 'SquareAPIError', status: 401 },
			);

			const calls = sent();
			expect(calls).toHaveLength(3);
			expect(calls.filter(isTokenCall)).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('makes a read that stays unauthorized after the refresh 2 Square requests and 1 refresh', async () => {
		const { corsair, testDb } = await createOAuthClient();
		try {
			fetchMock
				.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
				.mockResolvedValueOnce(jsonResponse(refreshed(NEW)))
				.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
				// Core running the endpoint again would take these.
				.mockResolvedValueOnce(jsonResponse(refreshed(NEXT)))
				.mockResolvedValueOnce(jsonResponse({ locations: [] }));

			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{ name: 'SquareAPIError', status: 401 },
			);

			const calls = sent();
			expect(calls.filter((r) => !isTokenCall(r))).toHaveLength(2);
			expect(calls.filter(isTokenCall)).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('opts out of core’s endpoint-level 401 retry', () => {
		expect(square({ authType: 'oauth_2' }).refreshOnUnauthorized).toBe(false);
		expect(square({ authType: 'api_key' }).refreshOnUnauthorized).toBe(false);
	});
});

describe('Square auth: a refused refresh', () => {
	/** A 401 from the API, then the token endpoint answers `refusal`. */
	async function refuseRefresh(refusal: Response) {
		const { corsair, testDb } = await createOAuthClient();
		fetchMock
			.mockResolvedValueOnce(jsonResponse(unauthorized, 401))
			.mockResolvedValueOnce(refusal)
			// A second Square request would take this.
			.mockResolvedValueOnce(jsonResponse({ locations: [] }));
		try {
			const error: unknown = await corsair.square.api.locations.list({}).then(
				() => undefined,
				(e: unknown) => e,
			);
			return { error, calls: sent() };
		} finally {
			testDb.cleanup();
		}
	}

	it('asks for a reconnect when Square refuses the refresh token (invalid_grant)', async () => {
		const { error, calls } = await refuseRefresh(
			jsonResponse({ error: 'invalid_grant' }, 400),
		);

		expect(error).toMatchObject({
			name: 'AuthMissingError',
			pluginId: 'square',
			authType: 'oauth_2',
			reason: 'revoked',
		});
		expect(calls.filter(isTokenCall)).toHaveLength(1);
		expect(calls.filter((r) => !isTokenCall(r))).toHaveLength(1);
	});

	it('treats a refusal in Square’s errors[] shape as revoked too', async () => {
		const { error, calls } = await refuseRefresh(
			jsonResponse(
				{
					errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }],
				},
				401,
			),
		);

		expect(error).toMatchObject({
			name: 'AuthMissingError',
			reason: 'revoked',
		});
		expect(calls).toHaveLength(2);
	});

	it('says the OAuth app is misconfigured when Square rejects its credentials', async () => {
		const { error, calls } = await refuseRefresh(
			jsonResponse({ error: 'invalid_client' }, 401),
		);

		expect(error).toBeInstanceOf(Error);
		expect(error).not.toMatchObject({ name: 'AuthMissingError' });
		expect((error as Error).message).toContain(
			'OAuth token refresh failed (401 invalid_client)',
		);
		expect(calls).toHaveLength(2);
	});

	it('rethrows a 503 from the token endpoint as is, not as a missing credential', async () => {
		const { error, calls } = await refuseRefresh(
			jsonResponse({ message: 'unavailable' }, 503),
		);

		expect(error).toMatchObject({
			name: 'OAuthRefreshError',
			status: 503,
			kind: 'transient',
		});
		expect(calls).toHaveLength(2);
	});
});

describe('Square auth: API key', () => {
	it('never refreshes: a 401 is the caller’s error after one attempt', async () => {
		const { corsair, testDb } = await createApiKeyClient();
		try {
			fetchMock.mockResolvedValue(jsonResponse(unauthorized, 401));

			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{ name: 'SquareAPIError', status: 401 },
			);

			expect(sent()).toHaveLength(1);
			expect(bearer(sent()[0] as SentRequest)).toBe(`Bearer ${TOKEN}`);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not refresh a static `key` option either', async () => {
		const { corsair, testDb } = await createOAuthClient({
			options: { key: 'EAAA-static-key' },
		});
		try {
			fetchMock.mockResolvedValue(jsonResponse(unauthorized, 401));

			await expect(corsair.square.api.locations.list({})).rejects.toMatchObject(
				{ status: 401 },
			);

			expect(sent()).toHaveLength(1);
			expect(bearer(sent()[0] as SentRequest)).toBe('Bearer EAAA-static-key');
		} finally {
			testDb.cleanup();
		}
	});
});
