import type { OAuthConfig } from '../core/plugins';
import { buildOAuthAuthorizeUrl } from '../oauth/authorize-url';

describe('buildOAuthAuthorizeUrl', () => {
	const oauthConfig = {
		providerName: 'GitHub',
		authUrl: 'https://github.com/login/oauth/authorize',
		tokenUrl: 'https://github.com/login/oauth/access_token',
		scopes: ['repo', 'user'],
		authParams: { allow_signup: 'false' },
	} satisfies OAuthConfig;

	it('builds a provider authorize URL with encoded query params', () => {
		const url = buildOAuthAuthorizeUrl({
			oauthConfig,
			clientId: 'client-id',
			redirectUri: 'https://app.example.com/oauth/callback',
			state: 'signed-state',
		});

		const parsed = new URL(url);
		expect(parsed.origin + parsed.pathname).toBe(
			'https://github.com/login/oauth/authorize',
		);
		expect(parsed.searchParams.get('client_id')).toBe('client-id');
		expect(parsed.searchParams.get('redirect_uri')).toBe(
			'https://app.example.com/oauth/callback',
		);
		expect(parsed.searchParams.get('response_type')).toBe('code');
		expect(parsed.searchParams.get('scope')).toBe('repo user');
		expect(parsed.searchParams.get('state')).toBe('signed-state');
		expect(parsed.searchParams.get('allow_signup')).toBe('false');
	});
});
