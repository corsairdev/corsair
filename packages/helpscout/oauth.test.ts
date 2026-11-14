import { AuthMissingError } from 'corsair/core';
import { getValidHelpScoutAccessToken, HELPSCOUT_TOKEN_URL } from './client';
import type {
	HelpScoutKeyBuilderContext,
	HelpScoutPluginOptions,
} from './index';
import { helpscout } from './index';

const fetchMock = jest.fn();
const realFetch = global.fetch;

beforeEach(() => {
	fetchMock.mockReset();
	// unknown: a jest.fn() mock is not structurally a `fetch`.
	global.fetch = fetchMock as unknown as typeof fetch;
});

afterAll(() => {
	global.fetch = realFetch;
});

// unknown: token bodies, good and bad, are arbitrary JSON.
function tokenResponse(body: Record<string, unknown>, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function sentForm(): URLSearchParams {
	const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
	return init.body as URLSearchParams;
}

describe('Help Scout OAuth tokens', () => {
	it('reuses a token that is not about to expire', async () => {
		const expiresAt = String(Math.floor(Date.now() / 1000) + 3600);
		const result = await getValidHelpScoutAccessToken({
			accessToken: 'live-token',
			expiresAt,
			clientId: 'id',
			clientSecret: 'secret',
		});
		expect(result).toMatchObject({
			accessToken: 'live-token',
			refreshed: false,
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('uses the client-credentials grant when there is no refresh token', async () => {
		fetchMock.mockResolvedValueOnce(
			tokenResponse({ access_token: 'new-token', expires_in: 172800 }),
		);
		const result = await getValidHelpScoutAccessToken({
			clientId: 'id',
			clientSecret: 'secret',
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(HELPSCOUT_TOKEN_URL);
		expect(sentForm().get('grant_type')).toBe('client_credentials');
		expect(sentForm().get('client_id')).toBe('id');
		expect(result).toMatchObject({ accessToken: 'new-token', refreshed: true });
	});

	it('uses the refresh token once the access token expired', async () => {
		fetchMock.mockResolvedValueOnce(
			tokenResponse({
				access_token: 'fresh',
				refresh_token: 'next-refresh',
				expires_in: 172800,
			}),
		);
		const result = await getValidHelpScoutAccessToken({
			accessToken: 'old',
			expiresAt: '1',
			refreshToken: 'old-refresh',
			clientId: 'id',
			clientSecret: 'secret',
		});
		expect(sentForm().get('grant_type')).toBe('refresh_token');
		expect(sentForm().get('refresh_token')).toBe('old-refresh');
		expect(result.refreshToken).toBe('next-refresh');
	});

	it('fails without leaking the client secret', async () => {
		fetchMock.mockResolvedValueOnce(
			tokenResponse({ error: 'invalid_client' }, 401),
		);
		await expect(
			getValidHelpScoutAccessToken({ clientId: 'id', clientSecret: 'shh' }),
		).rejects.toThrow('invalid_client');
	});
});

describe('Help Scout keyBuilder', () => {
	function keyCtx(stored: {
		accessToken?: string | null;
		expiresAt?: string | null;
		refreshToken?: string | null;
		clientId?: string | null;
	}) {
		const saved: Record<string, string> = {};
		const ctx = {
			authType: 'oauth_2',
			tenantId: 'tenant-1',
			keys: {
				get_access_token: async () =>
					saved.access_token ?? stored.accessToken ?? null,
				get_expires_at: async () =>
					saved.expires_at ?? stored.expiresAt ?? null,
				get_refresh_token: async () =>
					saved.refresh_token ?? stored.refreshToken ?? null,
				get_integration_credentials: async () => ({
					client_id: stored.clientId ?? null,
					client_secret: stored.clientId ? 'secret' : null,
					redirect_url: null,
				}),
				set_access_token: async (v: string) => {
					saved.access_token = v;
				},
				set_expires_at: async (v: string) => {
					saved.expires_at = v;
				},
				set_refresh_token: async (v: string) => {
					saved.refresh_token = v;
				},
			},
			// unknown: only the key-manager methods the keyBuilder calls are faked,
			// so the object cannot satisfy the full context type directly.
		} as unknown as HelpScoutKeyBuilderContext;
		return { ctx, saved };
	}

	// The forced-refresh callback core calls once after a 401.
	function refreshAuthOf(ctx: HelpScoutKeyBuilderContext) {
		// unknown: `_refreshAuth` is set by the keyBuilder, not declared on the type.
		return (ctx as unknown as { _refreshAuth?: () => Promise<string> })
			._refreshAuth;
	}

	it('refreshes an expired token with the refresh token and stores the new one', async () => {
		fetchMock.mockResolvedValueOnce(
			tokenResponse({
				access_token: 'renewed',
				refresh_token: 'next-refresh',
				expires_in: 172800,
			}),
		);
		const plugin = helpscout();
		const { ctx, saved } = keyCtx({
			accessToken: 'stale',
			expiresAt: '1',
			refreshToken: 'old-refresh',
			clientId: 'id',
		});
		const key = await plugin.keyBuilder?.(ctx, 'endpoint');
		expect(key).toBe('renewed');
		expect(sentForm().get('grant_type')).toBe('refresh_token');
		expect(saved.access_token).toBe('renewed');
		expect(saved.refresh_token).toBe('next-refresh');
		expect(Number(saved.expires_at)).toBeGreaterThan(Date.now() / 1000);
	});

	it('installs a forced refresh for a token Help Scout rejects before it expires', async () => {
		const plugin = helpscout();
		const { ctx, saved } = keyCtx({
			accessToken: 'still-fresh',
			expiresAt: String(Math.floor(Date.now() / 1000) + 3600),
			refreshToken: 'old-refresh',
			clientId: 'id',
		});
		expect(await plugin.keyBuilder?.(ctx, 'endpoint')).toBe('still-fresh');
		expect(fetchMock).not.toHaveBeenCalled();

		fetchMock.mockResolvedValueOnce(
			tokenResponse({ access_token: 'forced', expires_in: 172800 }),
		);
		const refresh = refreshAuthOf(ctx);
		expect(refresh).toBeInstanceOf(Function);
		expect(await refresh?.()).toBe('forced');
		expect(saved.access_token).toBe('forced');
	});

	it("does not hand an unconnected tenant the app owner's token", async () => {
		// The app's id and secret are shared by every tenant; a client-credentials
		// token reaches the account that owns the app, not this tenant's.
		const plugin = helpscout();
		const { ctx } = keyCtx({ clientId: 'id' });
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('mints a client-credentials token only in single-account mode', async () => {
		fetchMock.mockResolvedValueOnce(
			tokenResponse({ access_token: 'minted', expires_in: 172800 }),
		);
		const options: HelpScoutPluginOptions = { clientCredentials: true };
		const plugin = helpscout(options);
		const { ctx, saved } = keyCtx({ clientId: 'id' });
		expect(await plugin.keyBuilder?.(ctx, 'endpoint')).toBe('minted');
		expect(sentForm().get('grant_type')).toBe('client_credentials');
		expect(saved.access_token).toBe('minted');

		fetchMock.mockResolvedValueOnce(
			tokenResponse({ access_token: 'reminted', expires_in: 172800 }),
		);
		expect(await refreshAuthOf(ctx)?.()).toBe('reminted');
		expect(saved.access_token).toBe('reminted');
	});

	it('asks for a connection when nothing is stored', async () => {
		const plugin = helpscout();
		const { ctx } = keyCtx({});
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
