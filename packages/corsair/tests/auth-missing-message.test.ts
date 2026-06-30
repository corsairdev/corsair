import {
	formatDefaultAuthMissingMessage,
	resolveAuthMissingConnectMessage,
	resolveAuthMissingConnectUrl,
} from '../core/auth/auth-missing-message';
import type { CorsairPlugin } from '../core/plugins';
import type { HubConfig } from '../hub/types';

const mockHubConnectSession = {
	connectUrl: 'https://hub.example/connect/sess-1',
	token: 'hub-connect-token',
	projectId: 'proj-1',
	environmentId: 'env_dev_1',
	expiresAt: '2099-01-01T00:00:00.000Z',
};

jest.mock('../hub/connect', () => ({
	createHubConnectSessionForPlugin: jest.fn(async () => mockHubConnectSession),
}));

const { createHubConnectSessionForPlugin } = jest.requireMock('../hub/connect');

const hub: HubConfig = {
	apiUrl: 'https://hub.example',
	projectApiKey: 'ck_dev_test_key',
	signingSecret: 'signing-secret',
};

const slackPlugin = {
	id: 'slack',
	options: { authType: 'oauth_2' },
} as unknown as CorsairPlugin;

describe('formatDefaultAuthMissingMessage', () => {
	it('includes plugin id and connect URL', () => {
		expect(
			formatDefaultAuthMissingMessage(
				'slack',
				'https://hub.example/connect/sess-1',
			),
		).toBe(
			'[auth-missing:slack] Authentication required. Direct the user to connect their account: https://hub.example/connect/sess-1',
		);
	});
});

describe('resolveAuthMissingConnectUrl', () => {
	beforeEach(() => {
		createHubConnectSessionForPlugin.mockClear();
	});

	it('creates a hub connect session scoped to tenant and plugin', async () => {
		const url = await resolveAuthMissingConnectUrl(
			{ hub },
			{
				plugin: slackPlugin,
				tenantId: 'tenant-1',
				database: {} as never,
				kek: 'test-kek',
				plugins: [slackPlugin],
			},
		);

		expect(createHubConnectSessionForPlugin).toHaveBeenCalledWith(hub, {
			tenantId: 'tenant-1',
			plugin: slackPlugin,
			database: {},
			kek: 'test-kek',
			plugins: [slackPlugin],
		});
		expect(url).toBe('https://hub.example/connect/sess-1');
	});

	it('returns null when hub is not configured', async () => {
		const url = await resolveAuthMissingConnectUrl(
			{},
			{
				plugin: slackPlugin,
				tenantId: 'tenant-1',
				database: {} as never,
				kek: 'test-kek',
				plugins: [slackPlugin],
			},
		);
		expect(url).toBeNull();
	});
});

describe('resolveAuthMissingConnectMessage', () => {
	beforeEach(() => {
		createHubConnectSessionForPlugin.mockClear();
	});

	it('returns a connect link message when hub is configured', async () => {
		const msg = await resolveAuthMissingConnectMessage({
			hub,
			plugin: slackPlugin,
			pluginId: 'slack',
			tenantId: 'tenant-1',
			authType: 'oauth_2',
			database: {} as never,
			kek: 'test-kek',
			plugins: [slackPlugin],
		});

		expect(msg).toContain('[auth-missing:slack]');
		expect(msg).toContain('https://hub.example/connect/sess-1');
	});

	it('calls manual.onAuthMissing when configured', async () => {
		const onAuthMissing = jest.fn(
			({ connectUrl }: { connectUrl: string }) => `Connect here: ${connectUrl}`,
		);

		const msg = await resolveAuthMissingConnectMessage({
			hub,
			manual: { onAuthMissing },
			plugin: slackPlugin,
			pluginId: 'slack',
			tenantId: 'default',
			authType: 'oauth_2',
			database: {} as never,
			kek: 'test-kek',
			plugins: [slackPlugin],
		});

		expect(onAuthMissing).toHaveBeenCalledWith({
			plugin: 'slack',
			connectUrl: 'https://hub.example/connect/sess-1',
			state: 'hub-connect-token',
		});
		expect(msg).toBe('Connect here: https://hub.example/connect/sess-1');
	});

	it('returns fallback message when hub session creation fails', async () => {
		createHubConnectSessionForPlugin.mockRejectedValueOnce(
			new Error('hub down'),
		);

		const msg = await resolveAuthMissingConnectMessage({
			hub,
			plugin: slackPlugin,
			pluginId: 'slack',
			tenantId: 'default',
			authType: 'oauth_2',
			database: {} as never,
			kek: 'test-kek',
			plugins: [slackPlugin],
		});

		expect(msg).toBe(
			'[auth-missing:slack:oauth_2] Authentication required. Could not create connect link. Check hub configuration and server logs.',
		);
	});
});
