import { createAccountKeyManager, createCorsair } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { signDeliveryEnvelope } from '../hub/signing/envelope';
import { setupCorsair } from '../setup';
import { processCorsair } from '../tunnel';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/report-connection-status', () => ({
	...jest.requireActual('../hub/report-connection-status'),
	reportPluginConnectionStatus: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../oauth/subscribe-report', () => ({
	subscribeAndReport: jest.fn().mockResolvedValue(undefined),
}));

const KEK = 'test-kek-byo-e2e';
const SIGNING_SECRET = 'csec_byo_e2e';

const linearByo = {
	id: 'linear',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: [] as const } },
} as unknown as CorsairPlugin;

// End-to-end proof of the BYO delivery pipe: a signed oauth.tokens envelope
// (as Hub sends it, tagged oauth_2) goes through the real tunnel entry —
// signature verify → dispatch → handler → account store. The token value is an
// arbitrary string; what's proven is that it survives transit and lands in the
// oauth_2 account the plugin reads from (the authType-in-transit path B2 fixes).
describe('BYO oauth.tokens delivery — end to end over the tunnel', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('a signed delivery tagged oauth_2 lands the token in the BYO account', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [linearByo],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		const deliveredToken = 'rand-access-token-9f3a2c';
		const { body, headers } = signDeliveryEnvelope({
			projectId: 'proj_e2e',
			signingSecret: SIGNING_SECRET,
			type: 'oauth.tokens',
			payload: {
				plugin: 'linear',
				tenantId: 'default',
				accessToken: deliveredToken,
				refreshToken: 'rand-refresh-token-11b7',
				authType: 'oauth_2',
			},
		});

		const ack = await processCorsair(
			corsair,
			{ headers, body },
			{ signingSecret: SIGNING_SECRET },
		);
		expect(ack.status).toBe('ok');

		const km = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'linear',
			tenantId: 'default',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
		});
		expect(await km.get_access_token()).toBe(deliveredToken);
		expect(await km.get_refresh_token()).toBe('rand-refresh-token-11b7');
	});

	// Proves the provider-identity path end to end: a signed delivery carrying
	// providerData reaches the plugin's real resolver, which reads the token-body
	// identity and lands it on the account (Slack team_id → the field the plugin
	// requires; was silently dropped before providerData was forwarded).
	it('forwards providerData so the resolver lands team_id on the account', async () => {
		env = createTestDatabase();
		const slackManaged = {
			id: 'slack',
			options: { authType: 'managed' as const },
			authConfig: { managed: { account: ['team_id'] as const } },
			oauthWebhookTenantLinkResolver: (tokens: { team?: { id?: string } }) =>
				tokens?.team?.id
					? { linkType: 'team_id', externalId: tokens.team.id }
					: null,
		} as unknown as CorsairPlugin;
		const corsair = createCorsair({
			plugins: [slackManaged],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		const { body, headers } = signDeliveryEnvelope({
			projectId: 'proj_e2e',
			signingSecret: SIGNING_SECRET,
			type: 'oauth.tokens',
			payload: {
				plugin: 'slack',
				tenantId: 'default',
				accessToken: 'xoxb-e2e',
				authType: 'managed',
				providerData: { team: { id: 'T-E2E' } },
			},
		});

		const ack = await processCorsair(
			corsair,
			{ headers, body },
			{ signingSecret: SIGNING_SECRET },
		);
		expect(ack.status).toBe('ok');

		const km = createAccountKeyManager({
			authType: 'managed',
			integrationName: 'slack',
			tenantId: 'default',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
			extraAccountFields: ['team_id'],
		});
		expect(await km.get_access_token()).toBe('xoxb-e2e');
		expect(
			await (km as Record<string, () => Promise<string | null>>).get_team_id(),
		).toBe('T-E2E');
	});
});
