import {
	formatDefaultAuthMissingMessage,
	resolveAuthMissingConnectMessage,
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

describe('resolveAuthMissingConnectMessage', () => {
	beforeEach(() => {
		createHubConnectSessionForPlugin.mockClear();
	});

	it('returns a connect link message when hub is configured', async () => {
		const result = await resolveAuthMissingConnectMessage({
			hub,
			plugin: slackPlugin,
			pluginId: 'slack',
			tenantId: 'tenant-1',
			authType: 'oauth_2',
			database: {} as never,
			kek: 'test-kek',
			plugins: [slackPlugin],
		});

		expect(result.message).toContain('[auth-missing:slack]');
		expect(result.message).toContain('https://hub.example/connect/sess-1');
		expect(result.connectUrl).toBe('https://hub.example/connect/sess-1');
	});

	it('calls manual.onAuthMissing when configured', async () => {
		const onAuthMissing = jest.fn(
			({ connectUrl }: { connectUrl: string }) => `Connect here: ${connectUrl}`,
		);

		const result = await resolveAuthMissingConnectMessage({
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
		expect(result.message).toBe(
			'Connect here: https://hub.example/connect/sess-1',
		);
		expect(result.connectUrl).toBe('https://hub.example/connect/sess-1');
	});

	it('returns fallback message when hub session creation fails', async () => {
		createHubConnectSessionForPlugin.mockRejectedValueOnce(
			new Error('hub down'),
		);

		const result = await resolveAuthMissingConnectMessage({
			hub,
			plugin: slackPlugin,
			pluginId: 'slack',
			tenantId: 'default',
			authType: 'oauth_2',
			database: {} as never,
			kek: 'test-kek',
			plugins: [slackPlugin],
		});

		expect(result.message).toBe(
			'[auth-missing:slack:oauth_2] Authentication required. Could not create connect link. Check hub configuration and server logs.',
		);
		expect(result.connectUrl).toBeNull();
	});
});
