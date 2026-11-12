import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { RAMP_TOKEN_TIMEOUT_MS, RampAPIError } from './client';
import * as Org from './endpoints/org';
import type { RampContext } from './index';
import { RAMP_DEFAULT_SCOPES, ramp } from './index';
import { BUSINESS, TRANSACTION_PAGE } from './test-fixtures';
import { captureError, respond, spyOnFetch } from './test-support';

const CLIENT_ID = 'ramp_id_test';
const CLIENT_SECRET = 'ramp_sec_test_secret';
const BASIC = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;

type Stored = {
	client_id?: string;
	client_secret?: string;
	access_token?: string | null;
	expires_at?: string | null;
	refresh_token?: string | null;
};

/** An oauth_2 key store with the reads the keyBuilder makes and the writes it does. */
function oauthKeys(stored: Stored) {
	const state = { ...stored };
	const writes: Record<string, string> = {};
	const keys = {
		get_integration_credentials: async () => ({
			client_id: state.client_id,
			client_secret: state.client_secret,
		}),
		get_access_token: async () => state.access_token ?? null,
		get_expires_at: async () => state.expires_at ?? null,
		get_refresh_token: async () => state.refresh_token ?? null,
		set_access_token: async (value: string) => {
			writes.access_token = value;
			state.access_token = value;
		},
		set_expires_at: async (value: string) => {
			writes.expires_at = value;
			state.expires_at = value;
		},
		set_refresh_token: async (value: string) => {
			writes.refresh_token = value;
			state.refresh_token = value;
		},
		set_scope: async (value: string) => {
			writes.scope = value;
		},
	};
	return { keys, writes };
}

type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof ramp>): KeyBuilder {
	// unknown: the keyBuilder's context type is core's; the test passes a
	// duck-typed context with only the fields the Ramp keyBuilder reads.
	return (plugin as unknown as { keyBuilder: KeyBuilder }).keyBuilder;
}

function oauthCtx(keys: ReturnType<typeof oauthKeys>['keys']) {
	return {
		keys,
		hub: null,
		tenantId: 'default',
		authType: 'oauth_2',
	} as Record<string, unknown>;
}

const now = () => Math.floor(Date.now() / 1000);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

function tokenRequest(call = 0): { url: string; init: RequestInit } {
	const [url, init] = fetchMock.mock.calls[call] as [string, RequestInit];
	return { url: String(url), init };
}

function header(init: RequestInit, name: string): string | undefined {
	const headers = new Headers(init.headers);
	return headers.get(name) ?? undefined;
}

function formBody(init: RequestInit): URLSearchParams {
	return new URLSearchParams(String(init.body));
}

describe('oauthConfig', () => {
	it('points at production by default, with Basic client auth and every scope', () => {
		const config = ramp({ authType: 'oauth_2' }).oauthConfig;
		expect(config).toEqual({
			providerName: 'Ramp',
			authUrl: 'https://app.ramp.com/v1/authorize',
			tokenUrl: 'https://api.ramp.com/developer/v1/token',
			scopes: [...RAMP_DEFAULT_SCOPES],
			tokenAuthMethod: 'basic',
			requiresRegisteredRedirect: true,
		});
	});

	it('points at the sandbox hosts when environment is sandbox', () => {
		const config = ramp({ environment: 'sandbox' }).oauthConfig;
		expect(config?.authUrl).toBe('https://demo.ramp.com/v1/authorize');
		expect(config?.tokenUrl).toBe(
			'https://demo-api.ramp.com/developer/v1/token',
		);
	});

	it('requests only the scopes the caller passes', () => {
		const config = ramp({ scopes: ['transactions:read'] }).oauthConfig;
		expect(config?.scopes).toEqual(['transactions:read']);
	});
});

describe('oauth_2 without a refresh token: Client Credentials', () => {
	it('mints a token with Basic auth and every scope, then stores it with its expiry', async () => {
		respond(fetchMock, {
			access_token: 'ramp_business_tok_minted',
			token_type: 'Bearer',
			expires_in: 864000,
		});
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
		});

		const token = await keyBuilderOf(ramp({ authType: 'oauth_2' }))(
			oauthCtx(keys),
			'endpoint',
		);

		expect(token).toBe('ramp_business_tok_minted');
		const { url, init } = tokenRequest();
		expect(url).toBe('https://api.ramp.com/developer/v1/token');
		expect(init.method).toBe('POST');
		expect(header(init, 'Authorization')).toBe(BASIC);
		const body = formBody(init);
		expect(body.get('grant_type')).toBe('client_credentials');
		expect(body.get('scope')).toBe(RAMP_DEFAULT_SCOPES.join(' '));
		// The secret travels in the header only.
		expect(String(init.body)).not.toContain(CLIENT_SECRET);
		expect(writes.access_token).toBe('ramp_business_tok_minted');
		const expiresAt = Number(writes.expires_at);
		expect(expiresAt).toBeGreaterThanOrEqual(now() + 864000 - 5);
		expect(expiresAt).toBeLessThanOrEqual(now() + 864000 + 5);
	});

	it('reuses a stored token that is not close to expiry', async () => {
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			access_token: 'ramp_business_tok_cached',
			expires_at: String(now() + 86400),
		});

		const token = await keyBuilderOf(ramp({ authType: 'oauth_2' }))(
			oauthCtx(keys),
			'endpoint',
		);

		expect(token).toBe('ramp_business_tok_cached');
		expect(fetchMock).not.toHaveBeenCalled();
		expect(writes).toEqual({});
	});

	it('mints a new token when the stored one expires within five minutes', async () => {
		respond(fetchMock, {
			access_token: 'ramp_business_tok_new',
			expires_in: 864000,
		});
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			access_token: 'ramp_business_tok_old',
			expires_at: String(now() + 60),
		});

		const token = await keyBuilderOf(ramp({ authType: 'oauth_2' }))(
			oauthCtx(keys),
			'endpoint',
		);

		expect(token).toBe('ramp_business_tok_new');
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(writes.access_token).toBe('ramp_business_tok_new');
	});

	it('mints against the sandbox token URL with the scopes the caller chose', async () => {
		respond(fetchMock, { access_token: 'sandbox_tok', expires_in: 864000 });
		const { keys } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
		});

		await keyBuilderOf(
			ramp({
				authType: 'oauth_2',
				environment: 'sandbox',
				scopes: ['transactions:read', 'business:read'],
			}),
		)(oauthCtx(keys), 'endpoint');

		const { url, init } = tokenRequest();
		expect(url).toBe('https://demo-api.ramp.com/developer/v1/token');
		expect(formBody(init).get('scope')).toBe('transactions:read business:read');
	});

	it('reports a refused token request without the client secret', async () => {
		respond(
			fetchMock,
			{
				error_v2: {
					message: 'Client authentication failed.',
					error_code: 'DEVELOPER_7012',
					error_id: 'err_123',
				},
			},
			400,
		);
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
		});

		const error = await captureError(
			keyBuilderOf(ramp({ authType: 'oauth_2' }))(oauthCtx(keys), 'endpoint'),
		);

		expect(error).toBeInstanceOf(RampAPIError);
		const rampError = error as RampAPIError;
		expect(rampError.status).toBe(400);
		expect(rampError.code).toBe('DEVELOPER_7012');
		expect(rampError.message).toContain('Client authentication failed.');
		expect(rampError.message).not.toContain(CLIENT_SECRET);
		expect(writes).toEqual({});
	});

	it('fails when the token response carries no access token', async () => {
		respond(fetchMock, { token_type: 'Bearer' });
		const { keys } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
		});

		const error = await captureError(
			keyBuilderOf(ramp({ authType: 'oauth_2' }))(oauthCtx(keys), 'endpoint'),
		);

		expect(error).toBeInstanceOf(RampAPIError);
		expect(error.message).toBe('Ramp token response had no access_token');
	});
});

describe('oauth_2 with a refresh token: authorization code connection', () => {
	it('returns a fresh access token without calling Ramp and wires the 401 refresh', async () => {
		const { keys } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			access_token: 'ramp_tok_live',
			expires_at: String(now() + 3000),
			refresh_token: 'ramp_refresh',
		});
		const ctx = oauthCtx(keys);

		const token = await keyBuilderOf(ramp({ authType: 'oauth_2' }))(
			ctx,
			'endpoint',
		);

		expect(token).toBe('ramp_tok_live');
		expect(fetchMock).not.toHaveBeenCalled();
		expect(typeof ctx._refreshAuth).toBe('function');
	});

	it('refreshes an expired token with Basic auth and keeps the refresh token Ramp does not rotate', async () => {
		respond(fetchMock, {
			access_token: 'ramp_tok_refreshed',
			token_type: 'Bearer',
			expires_in: 3600,
		});
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			access_token: 'ramp_tok_expired',
			expires_at: String(now() - 10),
			refresh_token: 'ramp_refresh',
		});

		const token = await keyBuilderOf(
			ramp({ authType: 'oauth_2', environment: 'sandbox' }),
		)(oauthCtx(keys), 'endpoint');

		expect(token).toBe('ramp_tok_refreshed');
		const { url, init } = tokenRequest();
		expect(url).toBe('https://demo-api.ramp.com/developer/v1/token');
		expect(header(init, 'Authorization')).toBe(BASIC);
		const body = formBody(init);
		expect(body.get('grant_type')).toBe('refresh_token');
		expect(body.get('refresh_token')).toBe('ramp_refresh');
		expect(writes.access_token).toBe('ramp_tok_refreshed');
		expect(writes.refresh_token).toBeUndefined();
		expect(Number(writes.expires_at)).toBeGreaterThan(now() + 3500);
	});

	it('asks for a connection when there is neither a refresh token nor a client secret', async () => {
		const { keys } = oauthKeys({ client_id: CLIENT_ID });

		const error = await captureError(
			keyBuilderOf(ramp({ authType: 'oauth_2' }))(oauthCtx(keys), 'endpoint'),
		);

		expect(error.name).toBe('AuthMissingError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('environment', () => {
	it('sends a sandbox connection’s calls to the sandbox host', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'ramp', 'default');
		const corsair = createCorsair({
			plugins: [ramp({ key: 'sandbox-token', environment: 'sandbox' })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		try {
			respond(fetchMock, TRANSACTION_PAGE);

			await corsair.ramp.api.transactions.list({});

			const [url] = fetchMock.mock.calls[0] as [string];
			expect(String(url)).toMatch(
				/^https:\/\/demo-api\.ramp\.com\/developer\/v1\/transactions/,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends a production connection’s calls to the production host', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'ramp', 'default');
		const corsair = createCorsair({
			plugins: [ramp({ key: 'prod-token' })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		try {
			respond(fetchMock, TRANSACTION_PAGE);

			await corsair.ramp.api.transactions.list({});

			const [url] = fetchMock.mock.calls[0] as [string];
			expect(String(url)).toMatch(
				/^https:\/\/api\.ramp\.com\/developer\/v1\/transactions/,
			);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('token request limits', () => {
	it('gives the token request an abort signal and reports a timeout without the secret', async () => {
		fetchMock.mockImplementationOnce(async (_url, init?: RequestInit) => {
			expect(init?.signal).toBeInstanceOf(AbortSignal);
			throw new DOMException('The operation timed out.', 'TimeoutError');
		});
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
		});

		const error = await captureError(
			keyBuilderOf(ramp({ authType: 'oauth_2' }))(oauthCtx(keys), 'endpoint'),
		);

		expect(error).toBeInstanceOf(RampAPIError);
		expect(error.message).toBe(
			`Ramp token request timed out after ${RAMP_TOKEN_TIMEOUT_MS / 1000} s`,
		);
		expect(error.message).not.toContain(CLIENT_SECRET);
		expect(writes).toEqual({});
	});

	it('writes the new token before its expiry', async () => {
		respond(fetchMock, {
			access_token: 'ramp_tok_ordered',
			expires_in: 864000,
		});
		const order: string[] = [];
		const { keys } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
		});
		const setAccess = keys.set_access_token;
		const setExpiry = keys.set_expires_at;
		keys.set_access_token = async (value: string) => {
			await new Promise((resolve) => setTimeout(resolve, 5));
			order.push('access_token');
			await setAccess(value);
		};
		keys.set_expires_at = async (value: string) => {
			order.push('expires_at');
			await setExpiry(value);
		};

		await keyBuilderOf(ramp({ authType: 'oauth_2' }))(
			oauthCtx(keys),
			'endpoint',
		);

		expect(order).toEqual(['access_token', 'expires_at']);
	});
});

describe('client credentials refresh hook', () => {
	it('mints a new token when the request path asks, even while the stored one looks fresh', async () => {
		const { keys, writes } = oauthKeys({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			access_token: 'ramp_tok_revoked',
			expires_at: String(now() + 86400),
		});
		const ctx = oauthCtx(keys);

		const cached = await keyBuilderOf(ramp({ authType: 'oauth_2' }))(
			ctx,
			'endpoint',
		);
		expect(cached).toBe('ramp_tok_revoked');
		expect(fetchMock).not.toHaveBeenCalled();

		respond(fetchMock, {
			access_token: 'ramp_tok_replacement',
			expires_in: 864000,
		});
		const refresh = ctx._refreshAuth as () => Promise<string>;
		await expect(refresh()).resolves.toBe('ramp_tok_replacement');
		expect(formBody(tokenRequest(0).init).get('grant_type')).toBe(
			'client_credentials',
		);
		expect(writes.access_token).toBe('ramp_tok_replacement');
	});
});

describe('request path', () => {
	const REJECTED_TOKEN = {
		error_v2: {
			message: 'Invalid access token',
			error_code: 'DEVELOPER_7002',
		},
	};

	function endpointCtx(extra: Record<string, unknown> = {}): RampContext {
		// unknown: the endpoints read key, options, the refresh hook and the
		// encryption settings; the rest of a real context is not needed here.
		return {
			key: 'ramp_tok_old',
			options: {},
			...extra,
		} as unknown as RampContext;
	}

	function authHeader(call: number): string | undefined {
		return header(tokenRequest(call).init, 'Authorization');
	}

	it('refreshes once and retries when Ramp rejects the token', async () => {
		respond(fetchMock, REJECTED_TOKEN, 404);
		respond(fetchMock, BUSINESS);
		const refresh = jest.fn(async () => 'ramp_tok_new');

		const result = await Org.businessGet(
			endpointCtx({ _refreshAuth: refresh }) as never,
			{} as never,
		);

		expect(result.business.id).toBe(BUSINESS.id);
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(authHeader(0)).toBe('Bearer ramp_tok_old');
		expect(authHeader(1)).toBe('Bearer ramp_tok_new');
	});

	it('does not loop when the fresh token is rejected too', async () => {
		respond(fetchMock, REJECTED_TOKEN, 404);
		respond(fetchMock, REJECTED_TOKEN, 404);
		const refresh = jest.fn(async () => 'ramp_tok_new');

		const error = await captureError(
			Org.businessGet(
				endpointCtx({ _refreshAuth: refresh }) as never,
				{} as never,
			),
		);

		expect(error).toBeInstanceOf(RampAPIError);
		expect((error as RampAPIError).isAuthError).toBe(true);
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('throws the auth error unchanged when the connection has no refresh hook', async () => {
		respond(fetchMock, REJECTED_TOKEN, 404);

		const error = await captureError(
			Org.businessGet(endpointCtx() as never, {} as never),
		);

		expect((error as RampAPIError).code).toBe('DEVELOPER_7002');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('does not refresh on an error that is not about the token', async () => {
		respond(
			fetchMock,
			{ error_v2: { message: 'Not found', error_code: 'DEVELOPER_7004' } },
			404,
		);
		const refresh = jest.fn(async () => 'ramp_tok_new');

		const error = await captureError(
			Org.businessGet(
				endpointCtx({ _refreshAuth: refresh }) as never,
				{} as never,
			),
		);

		expect((error as RampAPIError).isNotFound).toBe(true);
		expect(refresh).not.toHaveBeenCalled();
	});

	it('refuses to send a write when encryption at rest has no key', async () => {
		const error = await captureError(
			Org.departmentsCreate(
				endpointCtx({ encryptDataAtRest: true, kek: '' }) as never,
				{ name: 'Engineering' } as never,
			),
		);

		expect(error.message).toContain('encryptDataAtRest is enabled but no kek');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
