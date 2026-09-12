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

	describe('keyBuilder', () => {
		it('returns explicit option key for endpoints if provided', async () => {
			const plugin = chatwork({ key: 'explicit-api-key' });
			const ctx = {
				keys: {
					get_api_key: jest.fn(),
					get_access_token: jest.fn(),
					get_webhook_signature: jest.fn(),
				},
				authType: 'api_key',
			};

			const keyBuilder = plugin.keyBuilder as any;
			expect(keyBuilder).toBeDefined();
			const key = await keyBuilder(ctx, 'endpoint');
			expect(key).toBe('explicit-api-key');
		});

		it('retrieves access_token for oauth_2 endpoints', async () => {
			const plugin = chatwork();
			const ctx = {
				keys: {
					get_api_key: jest.fn(),
					get_access_token: jest.fn().mockResolvedValue('oauth-token-123'),
					get_webhook_signature: jest.fn(),
				},
				authType: 'oauth_2',
			};

			const keyBuilder = plugin.keyBuilder as any;
			expect(keyBuilder).toBeDefined();
			const key = await keyBuilder(ctx, 'endpoint');
			expect(key).toBe('oauth-token-123');
		});

		it('retrieves webhook secret from options or keys', async () => {
			const pluginWithOptions = chatwork({ webhookSecret: 'secret-option' });
			const ctx = {
				keys: {
					get_webhook_signature: jest.fn().mockResolvedValue('stored-secret'),
				},
			};

			const keyBuilderWithOptions = pluginWithOptions.keyBuilder as any;
			const key1 = await keyBuilderWithOptions(ctx, 'webhook');
			expect(key1).toBe('secret-option');

			const defaultPlugin = chatwork();
			const defaultKeyBuilder = defaultPlugin.keyBuilder as any;
			const key2 = await defaultKeyBuilder(ctx, 'webhook');
			expect(key2).toBe('stored-secret');
		});
	});
});
