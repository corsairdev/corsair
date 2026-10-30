import { getOAuthAccessToken } from 'corsair/core';
import { resolveConfluenceCloudResource } from './client';
import { confluence } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	getOAuthAccessToken: jest.fn(),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	resolveConfluenceCloudResource: jest.fn(),
}));

const mockGetOAuthAccessToken = jest.mocked(getOAuthAccessToken);
const mockResolveConfluenceCloudResource = jest.mocked(
	resolveConfluenceCloudResource,
);

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

	it('acquires the OAuth token via the shared switchboard', async () => {
		const plugin = confluence({ authType: 'oauth_2' });
		const keyBuilder = endpointKeyBuilder(plugin);
		mockGetOAuthAccessToken.mockResolvedValue('switchboard-access-token');

		// cloud site already resolved → no re-resolution
		const keys = {
			get_cloud_id: jest.fn().mockResolvedValue('cloud-123'),
			get_cloud_url: jest.fn().mockResolvedValue('https://acme.atlassian.net'),
			set_cloud_id: jest.fn(),
			set_cloud_url: jest.fn(),
		};
		const hub = { baseUrl: 'https://hub.example' };

		await expect(
			keyBuilder(
				{
					authType: 'oauth_2',
					options: plugin.options,
					keys,
					hub,
					tenantId: 't1',
				},
				'endpoint',
			),
		).resolves.toBe('switchboard-access-token');

		expect(mockGetOAuthAccessToken).toHaveBeenCalledWith(
			expect.objectContaining({ keys, hub, tenantId: 't1' }),
			{
				plugin: 'confluence',
				tokenUrl: 'https://auth.atlassian.com/oauth/token',
				bodyFormat: 'json',
			},
		);
		expect(mockResolveConfluenceCloudResource).not.toHaveBeenCalled();
		expect(keys.set_cloud_id).not.toHaveBeenCalled();
	});

	it('resolves and persists the cloud site on first oauth use', async () => {
		const plugin = confluence({ authType: 'oauth_2' });
		const keyBuilder = endpointKeyBuilder(plugin);
		mockGetOAuthAccessToken.mockResolvedValue('switchboard-access-token');
		mockResolveConfluenceCloudResource.mockResolvedValue({
			id: 'cloud-xyz',
			url: 'https://acme.atlassian.net',
			name: 'Acme',
			scopes: [],
		});

		const keys = {
			get_cloud_id: jest.fn().mockResolvedValue(null),
			get_cloud_url: jest.fn().mockResolvedValue(null),
			set_cloud_id: jest.fn(),
			set_cloud_url: jest.fn(),
		};

		await keyBuilder(
			{
				authType: 'oauth_2',
				options: plugin.options,
				keys,
				hub: {},
				tenantId: 't1',
			},
			'endpoint',
		);

		expect(mockResolveConfluenceCloudResource).toHaveBeenCalledWith(
			'switchboard-access-token',
			null,
		);
		expect(keys.set_cloud_id).toHaveBeenCalledWith('cloud-xyz');
		expect(keys.set_cloud_url).toHaveBeenCalledWith(
			'https://acme.atlassian.net',
		);
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
