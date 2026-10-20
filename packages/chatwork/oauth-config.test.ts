import { chatwork, chatworkAuthConfig } from './index';

describe('Chatwork OAuth and Auth Configuration', () => {
	it('defines correct authConfig linking account_id', () => {
		expect(chatworkAuthConfig.api_key.account).toEqual(['account_id']);
		expect(chatworkAuthConfig.oauth_2.account).toEqual(['account_id']);
	});

	it('configures OAuth endpoints and necessary scopes', () => {
		const plugin = chatwork();
		expect(plugin.oauthConfig).toBeDefined();
		expect(plugin.oauthConfig?.providerName).toBe('Chatwork');
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://www.chatwork.com/packages/oauth2/login.php',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://oauth.chatwork.com/token',
		);

		const expectedScopes = [
			'users.profile.me:read',
			'rooms.info:read',
			'rooms.messages:read',
			'rooms.members:read',
			'rooms.messages:write',
			'offline_access',
		];

		for (const scope of expectedScopes) {
			expect(plugin.oauthConfig?.scopes).toContain(scope);
		}
	});
});
