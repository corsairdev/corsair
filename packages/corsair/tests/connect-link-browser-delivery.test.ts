import { createCorsair } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import { CLIENT_BRIDGE_MESSAGE_TYPE } from '../hub/browser-delivery-html';
import { handleHubDeliveryGet } from '../hub/delivery';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import { signBrowserDeliveryToken } from '../hub/signing/browser-delivery';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

const slackOAuth = {
	id: 'slack',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'Slack',
		authUrl: 'https://slack.com/oauth/v2/authorize',
		tokenUrl: 'https://slack.com/api/oauth.v2.access',
		scopes: ['channels:read'],
	},
} as unknown as CorsairPlugin;

describe('connect.create_link browser delivery', () => {
	const env = createTestDatabase();
	const originalFetch = global.fetch;

	beforeEach(() => {
		resetDeliveryReplayGuardForTests();
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('returns a connect link via the client bridge', async () => {
		global.fetch = jest.fn(async () =>
			Response.json({
				connectUrl: 'https://hub.example/connect/sess-test',
				expiresAt: '2026-07-11T01:00:00.000Z',
				token: 'hub-connect-token',
				projectId: 'proj_test',
				environmentId: 'env_dev_1',
			}),
		) as typeof fetch;

		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: 'test-kek-connect-link',
			hub: {
				apiUrl: 'https://hub.example',
				projectApiKey: 'ck_dev_test_key',
				signingSecret: 'signing-secret',
			},
		} as any);

		await setupCorsair(corsair, { silent: true });
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const requestId = 'connect-link-request-1';
		const token = signBrowserDeliveryToken(
			{
				connectJti: requestId,
				projectId: 'proj_test',
				plugin: 'connect.create_link',
				tenantId: 'default',
				hubSuccessUrl: 'http://localhost:3000',
				deliveryMode: 'connect.create_link',
				hubOrigin: 'http://localhost:3000',
				requestId,
				connectLinkPlugins: ['slack'],
			},
			'signing-secret',
		);

		const result = await handleHubDeliveryGet(
			corsair,
			`http://localhost:3000/api/corsair?d=${encodeURIComponent(token)}`,
		);

		expect(result.type).toBe('text');
		if (result.type !== 'text' || !result.body) return;

		expect(result.body).toContain(CLIENT_BRIDGE_MESSAGE_TYPE);
		expect(result.body).toContain(requestId);

		const messageMatch = result.body.match(/var message = (\{.*?\});/s);
		expect(messageMatch?.[1]).toBeTruthy();
		const message = JSON.parse(messageMatch![1]!) as {
			ok: boolean;
			body: { connectUrl?: string; expiresAt?: string };
			error?: string;
		};
		expect(message).toMatchObject({
			ok: true,
			body: {
				connectUrl: 'https://hub.example/connect/sess-test',
				expiresAt: '2026-07-11T01:00:00.000Z',
			},
		});
	});
});
