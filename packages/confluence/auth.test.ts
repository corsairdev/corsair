import {
	getValidConfluenceAccessToken,
	normalizeConfluenceCloudUrl,
	resolveConfluenceCloudResource,
} from './client';
import { confluence } from './index';

jest.mock('./client', () => ({
	getValidConfluenceAccessToken: jest.fn(),
	normalizeConfluenceCloudUrl: jest.fn((value: string) => {
		let end = value.length;
		while (end > 0 && value.charCodeAt(end - 1) === 47) end -= 1;
		return value.slice(0, end);
	}),
	resolveConfluenceCloudResource: jest.fn(),
}));

const mockGetValidAccessToken = jest.mocked(getValidConfluenceAccessToken);
const mockNormalizeCloudUrl = jest.mocked(normalizeConfluenceCloudUrl);
const mockResolveCloudResource = jest.mocked(resolveConfluenceCloudResource);

function endpointKeyBuilder(plugin: ReturnType<typeof confluence>) {
	return plugin.keyBuilder as (
		ctx: Record<string, unknown>,
		source: 'endpoint',
	) => Promise<string>;
}

describe('Confluence authentication', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('declares Atlassian OAuth metadata with offline access', () => {
		const plugin = confluence();

		expect(plugin.oauthConfig).toEqual(
			expect.objectContaining({
				providerName: 'Confluence',
				authUrl: 'https://auth.atlassian.com/authorize',
				tokenUrl: 'https://auth.atlassian.com/oauth/token',
				scopes: expect.arrayContaining([
					'offline_access',
					'read:page:confluence',
					'read:space:confluence',
					'search:confluence',
				]),
				authParams: {
					audience: 'api.atlassian.com',
					prompt: 'consent',
				},
			}),
		);
	});

	it('builds a Basic credential from the stored email and API token', async () => {
		const plugin = confluence({ authType: 'api_key' });
		const keyBuilder = endpointKeyBuilder(plugin);
		const ctx = {
			authType: 'api_key',
			options: plugin.options,
			keys: {
				get_api_key: jest.fn().mockResolvedValue('api-token'),
				get_email: jest.fn().mockResolvedValue('user@example.com'),
			},
		};

		await expect(keyBuilder(ctx, 'endpoint')).resolves.toBe(
			'user@example.com:api-token',
		);
	});

	it('rejects a bare API token when no account email is configured', async () => {
		const plugin = confluence({ authType: 'api_key' });
		const keyBuilder = endpointKeyBuilder(plugin);
		const ctx = {
			authType: 'api_key',
			options: plugin.options,
			keys: {
				get_api_key: jest.fn().mockResolvedValue('api-token'),
				get_email: jest.fn().mockResolvedValue(null),
			},
		};

		await expect(keyBuilder(ctx, 'endpoint')).rejects.toThrow('email');
	});

	it('refreshes OAuth credentials, selects the configured site, and persists both', async () => {
		const plugin = confluence({
			authType: 'oauth_2',
			cloudUrl: 'https://b.atlassian.net',
		});
		const keyBuilder = endpointKeyBuilder(plugin);
		mockGetValidAccessToken.mockResolvedValue({
			accessToken: 'new-access-token',
			refreshToken: 'new-refresh-token',
			expiresAt: 12345,
			refreshed: true,
		});
		mockResolveCloudResource.mockResolvedValue({
			id: 'site-b',
			url: 'https://b.atlassian.net',
			name: 'Site B',
			scopes: ['read:confluence-content.summary'],
		});

		const keys = {
			get_access_token: jest.fn().mockResolvedValue('old-access-token'),
			get_expires_at: jest.fn().mockResolvedValue('1'),
			get_refresh_token: jest.fn().mockResolvedValue('old-refresh-token'),
			get_cloud_url: jest.fn().mockResolvedValue(null),
			get_cloud_id: jest.fn().mockResolvedValue(null),
			get_integration_credentials: jest.fn().mockResolvedValue({
				client_id: 'client-id',
				client_secret: 'client-secret',
			}),
			set_access_token: jest.fn().mockResolvedValue(undefined),
			set_expires_at: jest.fn().mockResolvedValue(undefined),
			set_refresh_token: jest.fn().mockResolvedValue(undefined),
			set_cloud_url: jest.fn().mockResolvedValue(undefined),
			set_cloud_id: jest.fn().mockResolvedValue(undefined),
		};

		await expect(
			keyBuilder(
				{
					authType: 'oauth_2',
					options: plugin.options,
					keys,
				},
				'endpoint',
			),
		).resolves.toBe('new-access-token');

		expect(mockResolveCloudResource).toHaveBeenCalledWith(
			'new-access-token',
			'https://b.atlassian.net',
		);
		expect(keys.set_access_token).toHaveBeenCalledWith('new-access-token');
		expect(keys.set_refresh_token).toHaveBeenCalledWith('new-refresh-token');
		expect(keys.set_cloud_id).toHaveBeenCalledWith('site-b');
		expect(keys.set_cloud_url).toHaveBeenCalledWith('https://b.atlassian.net');
	});

	it('uses safe URL normalization when comparing a stored OAuth site', async () => {
		const plugin = confluence({
			authType: 'oauth_2',
			cloudUrl: 'https://b.atlassian.net/',
		});
		const keyBuilder = endpointKeyBuilder(plugin);
		mockGetValidAccessToken.mockResolvedValue({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
			expiresAt: 12_345,
			refreshed: false,
		});

		await keyBuilder(
			{
				authType: 'oauth_2',
				options: plugin.options,
				keys: {
					get_access_token: jest.fn().mockResolvedValue('access-token'),
					get_expires_at: jest.fn().mockResolvedValue('9999999999'),
					get_refresh_token: jest.fn().mockResolvedValue('refresh-token'),
					get_cloud_url: jest.fn().mockResolvedValue('https://b.atlassian.net'),
					get_cloud_id: jest.fn().mockResolvedValue('site-b'),
					get_integration_credentials: jest.fn().mockResolvedValue({
						client_id: 'client-id',
						client_secret: 'client-secret',
					}),
				},
			},
			'endpoint',
		);

		expect(mockNormalizeCloudUrl).toHaveBeenCalledWith(
			'https://b.atlassian.net/',
		);
		expect(mockNormalizeCloudUrl).toHaveBeenCalledWith(
			'https://b.atlassian.net',
		);
		expect(mockResolveCloudResource).not.toHaveBeenCalled();
	});

	it('does not expose placeholder webhooks', () => {
		const plugin = confluence();

		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-atlassian-webhook-identifier': 'delivery-id' },
				body: JSON.stringify({ webhookEvent: 'page_created' }),
			} as never),
		).toBe(false);
	});
});
