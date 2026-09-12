import { snapchat } from './index';

describe('snapchat plugin', () => {
	it('registers oauth auth, no webhooks, and full endpoint surface', () => {
		const plugin = snapchat({ composioApiKey: 'ck_test' });
		expect(plugin.id).toBe('snapchat');
		expect(plugin.authConfig).toEqual({ oauth_2: {} });
		expect(plugin.oauthConfig?.scopes).toEqual(['snapchat-marketing-api']);
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
		expect(Object.keys(plugin.endpoints?.actions ?? {})).toHaveLength(139);
	});
});
