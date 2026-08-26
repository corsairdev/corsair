import { spotify } from './index';

// Spotify's oauthConfig declares tokenAuthMethod: 'basic'. The migrated keyBuilder
// must forward it to getOAuthAccessToken, or the refresh silently falls back to
// the 'body' default and authenticates the wrong way.
function staleOAuthKeys() {
	return {
		get_integration_credentials: async () => ({
			client_id: 'cid',
			client_secret: 'csecret',
		}),
		get_access_token: async () => 'stale',
		get_expires_at: async () => '1',
		get_refresh_token: async () => 'rt',
		set_access_token: async () => {},
		set_expires_at: async () => {},
		set_refresh_token: async () => {},
		set_scope: async () => {},
	};
}

describe('spotify oauth_2 refresh auth method', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('authenticates the token refresh with HTTP Basic', async () => {
		let authHeader: string | undefined;
		global.fetch = (async (_url: string, init: RequestInit) => {
			authHeader = (init.headers as Record<string, string>).Authorization;
			return {
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () =>
					JSON.stringify({ access_token: 'new', expires_in: 3600 }),
			} as unknown as Response;
		}) as unknown as typeof fetch;

		const plugin = spotify();
		const ctx: Record<string, unknown> = {
			keys: staleOAuthKeys(),
			tenantId: 'default',
			authType: 'oauth_2',
			options: {},
		};
		const keyBuilder = (plugin as { keyBuilder?: unknown }).keyBuilder as (
			c: unknown,
			s: string,
		) => Promise<string>;
		await keyBuilder(ctx, 'endpoint');

		expect(authHeader).toMatch(/^Basic /);
	});
});
