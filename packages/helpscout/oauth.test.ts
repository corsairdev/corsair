import { getValidHelpScoutAccessToken, HELPSCOUT_TOKEN_URL } from './client';
import type { HelpScoutKeyBuilderContext } from './index';
import { helpscout } from './index';

const fetchMock = jest.fn();
const realFetch = global.fetch;

beforeEach(() => {
	fetchMock.mockReset();
	global.fetch = fetchMock as unknown as typeof fetch;
});

afterAll(() => {
	global.fetch = realFetch;
});

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
		clientId?: string | null;
	}) {
		const saved: Record<string, string> = {};
		const ctx = {
			authType: 'oauth_2',
			keys: {
				get_access_token: async () => stored.accessToken ?? null,
				get_expires_at: async () => stored.expiresAt ?? null,
				get_refresh_token: async () => null,
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
		} as unknown as HelpScoutKeyBuilderContext;
		return { ctx, saved };
	}

	it('refreshes an expired token and stores the new one', async () => {
		fetchMock.mockResolvedValueOnce(
			tokenResponse({ access_token: 'renewed', expires_in: 172800 }),
		);
		const plugin = helpscout();
		const { ctx, saved } = keyCtx({
			accessToken: 'stale',
			expiresAt: '1',
			clientId: 'id',
		});
		const key = await plugin.keyBuilder?.(ctx, 'endpoint');
		expect(key).toBe('renewed');
		expect(saved.access_token).toBe('renewed');
		expect(Number(saved.expires_at)).toBeGreaterThan(Date.now() / 1000);
	});

	it('asks for a connection when nothing is stored', async () => {
		const plugin = helpscout();
		const { ctx } = keyCtx({});
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
