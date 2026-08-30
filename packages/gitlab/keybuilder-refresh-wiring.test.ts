import { gitlab } from './index';

// A migrated oauth_2 keyBuilder must attach `_refreshAuth` onto the SAME ctx the
// framework forwards to the plugin's client, so a 401 can force-refresh and retry.
// Regression guard: passing a throwaway `{ keys, hub, tenantId }` literal to
// getOAuthAccessToken drops the callback and silently kills 401 recovery.
function freshOAuthKeys() {
	const farFuture = String(Math.floor(Date.now() / 1000) + 100_000);
	return {
		get_integration_credentials: async () => ({
			client_id: 'cid',
			client_secret: 'csecret',
		}),
		get_access_token: async () => 'fresh-access',
		get_expires_at: async () => farFuture,
		get_refresh_token: async () => 'rt',
		set_access_token: async () => {},
		set_expires_at: async () => {},
		set_refresh_token: async () => {},
		set_scope: async () => {},
	};
}

describe('gitlab oauth_2 keyBuilder 401 wiring', () => {
	it('attaches _refreshAuth onto the real ctx', async () => {
		// biome-ignore lint/suspicious/noExplicitAny: minimal plugin options for the test
		const plugin = gitlab({ baseUrl: 'https://gitlab.com' } as any);
		const ctx: Record<string, unknown> = {
			keys: freshOAuthKeys(),
			hub: {
				apiUrl: 'https://hub.test',
				projectApiKey: 'ck',
				signingSecret: 's',
			},
			tenantId: 'default',
			authType: 'oauth_2',
			options: { baseUrl: 'https://gitlab.com' },
		};

		// biome-ignore lint/suspicious/noExplicitAny: ctx shape is duck-typed for the test
		const keyBuilder = (plugin as any).keyBuilder as (
			c: unknown,
			s: string,
		) => Promise<string>;
		const token = await keyBuilder(ctx, 'endpoint');

		expect(token).toBe('fresh-access');
		expect(typeof ctx._refreshAuth).toBe('function');
	});
});
