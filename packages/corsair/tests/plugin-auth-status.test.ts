import { createCorsair } from '../core';
import {
	getPluginAuthStatus,
	getPluginAuthStatusForTenant,
} from '../core/auth/plugin-auth-status';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getConnectStatusForTenant } from '../hub/connect-status';
import { parseConnectStatusResponse } from '../hub/contracts/connect-api';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-plugin-auth-status';

const slackApiKey = {
	id: 'slack',
	options: { authType: 'api_key' as const },
	authConfig: {
		api_key: {
			account: ['team_id'] as const,
		},
	},
} as unknown as CorsairPlugin;

const githubManaged = {
	id: 'github',
	options: { authType: 'managed' as const },
	authConfig: {
		managed: {
			account: ['installation_id'] as const,
		},
	},
} as unknown as CorsairPlugin;

describe('getPluginAuthStatus', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('reports partial but connected when core api_key is set', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackApiKey],
			database: env.db,
			kek: KEK,
		} as any);

		await setupCorsair(corsair);
		await (corsair as any).slack.keys.set_api_key('xoxb-test');

		const status = await getPluginAuthStatus(
			getCorsairInternal(corsair),
			slackApiKey,
			'default',
		);

		expect(status?.status).toBe('partial');
		expect(status?.connected).toBe(true);
		expect(status?.missingRequiredFields).toEqual(['team_id']);
		expect(
			status?.fields.find((field) => field.name === 'api_key')?.configured,
		).toBe(true);
		expect(
			status?.fields.find((field) => field.name === 'team_id')?.configured,
		).toBe(false);
	});

	it('reports ready when all required account fields are set', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackApiKey],
			database: env.db,
			kek: KEK,
		} as any);

		await setupCorsair(corsair);
		await (corsair as any).slack.keys.set_api_key('xoxb-test');
		await (corsair as any).slack.keys.set_team_id('T123');

		const statuses = await getPluginAuthStatusForTenant(
			getCorsairInternal(corsair),
			'default',
		);

		expect(statuses[0]?.status).toBe('ready');
		expect(statuses[0]?.connected).toBe(true);
	});

	it('reports partial but connected when oauth tokens are set without extras', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [githubManaged],
			database: env.db,
			kek: KEK,
		} as any);

		await setupCorsair(corsair);
		await (corsair as any).github.keys.set_access_token('gho_test');
		await (corsair as any).github.keys.set_refresh_token('ghr_test');

		const status = await getPluginAuthStatus(
			getCorsairInternal(corsair),
			githubManaged,
			'default',
		);

		expect(status?.status).toBe('partial');
		expect(status?.connected).toBe(true);
		expect(status?.missingRequiredFields).toEqual(['installation_id']);
	});

	it('does not treat provisioned DEKs alone as connected', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackApiKey],
			database: env.db,
			kek: KEK,
		} as any);

		await setupCorsair(corsair);

		const connectStatus = await getConnectStatusForTenant(corsair, 'default');

		expect(connectStatus.plugins[0]?.connected).toBe(false);
		expect(connectStatus.plugins[0]?.status).toBe('not_started');
	});
});

describe('parseConnectStatusResponse', () => {
	it('parses field-level connect status payloads', () => {
		const parsed = parseConnectStatusResponse({
			tenantId: 'default',
			plugins: [
				{
					plugin: 'slack',
					providerName: 'Slack',
					authKind: 'api_key',
					status: 'partial',
					connected: false,
					fields: [
						{
							name: 'api_key',
							level: 'account',
							required: true,
							configured: true,
						},
						{
							name: 'team_id',
							level: 'account',
							required: true,
							configured: false,
						},
					],
					missingRequiredFields: ['team_id'],
				},
			],
		});

		expect(parsed.plugins[0]?.status).toBe('partial');
		expect(parsed.plugins[0]?.fields).toHaveLength(2);
		expect(parsed.plugins[0]?.missingRequiredFields).toEqual(['team_id']);
	});
});
