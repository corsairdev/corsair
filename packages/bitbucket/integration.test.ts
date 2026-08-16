import { bitbucket } from './index';

describe('Bitbucket integration', () => {
	it('uses OAuth 2.0 and intentionally exposes no webhooks', () => {
		const plugin = bitbucket({ key: 'test-token', authType: 'oauth_2' });
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://bitbucket.org/site/oauth2/authorize',
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});
});
