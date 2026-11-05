import { lever } from './index';

const realFetch = global.fetch;

afterEach(() => {
	global.fetch = realFetch;
});

const nowSeconds = () => Math.floor(Date.now() / 1000);

// A minimal oauth_2 key manager for a tenant whose client secret is held
// locally, so getOAuthAccessToken refreshes against Lever directly.
const oauthKeys = (overrides: { accessToken: string; expiresAt: number }) => ({
	get_integration_credentials: jest
		.fn()
		.mockResolvedValue({ client_id: 'client-1', client_secret: 'secret-1' }),
	get_access_token: jest.fn().mockResolvedValue(overrides.accessToken),
	get_expires_at: jest.fn().mockResolvedValue(String(overrides.expiresAt)),
	get_refresh_token: jest.fn().mockResolvedValue('refresh-1'),
	set_access_token: jest.fn().mockResolvedValue(undefined),
	set_expires_at: jest.fn().mockResolvedValue(undefined),
	set_refresh_token: jest.fn().mockResolvedValue(undefined),
	set_scope: jest.fn().mockResolvedValue(undefined),
});

describe('Lever OAuth credentials', () => {
	it('refreshes an expired one-hour access token at auth.lever.co', async () => {
		const calls: { url: string; body: string }[] = [];
		const stub: typeof global.fetch = async (input, init) => {
			calls.push({ url: String(input), body: String(init?.body) });
			return new Response(
				JSON.stringify({
					access_token: 'fresh-token',
					refresh_token: 'refresh-2',
					expires_in: 3600,
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			);
		};
		global.fetch = stub;
		const keys = oauthKeys({
			accessToken: 'expired-token',
			expiresAt: nowSeconds() - 60,
		});
		const plugin = lever({ authType: 'oauth_2' });

		const token = await plugin.keyBuilder?.(
			{ authType: 'oauth_2', tenantId: 'tenant-1', keys } as never,
			'endpoint',
		);

		expect(token).toBe('fresh-token');
		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe('https://auth.lever.co/oauth/token');
		const body = new URLSearchParams(calls[0]?.body);
		expect(body.get('grant_type')).toBe('refresh_token');
		expect(body.get('refresh_token')).toBe('refresh-1');
		// Lever rotates refresh tokens: the new one must be stored.
		expect(keys.set_access_token).toHaveBeenCalledWith('fresh-token');
		expect(keys.set_refresh_token).toHaveBeenCalledWith('refresh-2');
	});

	it('reuses a still-valid access token without calling Lever', async () => {
		const fetchSpy = jest.fn();
		global.fetch = fetchSpy as never;
		const keys = oauthKeys({
			accessToken: 'live-token',
			expiresAt: nowSeconds() + 1800,
		});
		const plugin = lever({ authType: 'oauth_2' });

		const token = await plugin.keyBuilder?.(
			{ authType: 'oauth_2', tenantId: 'tenant-1', keys } as never,
			'endpoint',
		);

		expect(token).toBe('live-token');
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('asks for a refresh token and the API audience when authorizing', () => {
		const plugin = lever({ authType: 'oauth_2' });
		expect(plugin.oauthConfig?.authUrl).toBe('https://auth.lever.co/authorize');
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://auth.lever.co/oauth/token',
		);
		expect(plugin.oauthConfig?.scopes).toContain('offline_access');
		expect(plugin.oauthConfig?.authParams).toEqual({
			audience: 'https://api.lever.co/v1/',
		});
	});

	it('fails with an auth-missing error when no API key is stored', async () => {
		const plugin = lever();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: jest.fn().mockResolvedValue(null) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(/lever/);
	});
});
