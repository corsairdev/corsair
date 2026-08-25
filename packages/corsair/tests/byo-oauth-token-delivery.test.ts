import { createAccountKeyManager, createCorsair } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/report-connection-status', () => ({
	...jest.requireActual('../hub/report-connection-status'),
	reportPluginConnectionStatus: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../oauth/subscribe-report', () => ({
	subscribeAndReport: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../webhooks/resolve-oauth-tenant-link', () => ({
	resolveOAuthWebhookTenantLink: jest.fn().mockResolvedValue(null),
}));

jest.mock('../webhooks/tenant-links', () => ({
	setWebhookTenantLink: jest.fn().mockResolvedValue(undefined),
}));

import { processManagedOAuthDelivery } from '../hub/managed-oauth';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';
import { setWebhookTenantLink } from '../webhooks/tenant-links';

const KEK = 'test-kek-byo-oauth-delivery';

const linearByo = {
	id: 'linear',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: [] as const } },
} as unknown as CorsairPlugin;

function makeCorsair(env: ReturnType<typeof createTestDatabase>) {
	return createCorsair({
		plugins: [linearByo],
		database: env.db,
		kek: KEK,
	} as any);
}

describe('processManagedOAuthDelivery — BYO (oauth_2) mode', () => {
	let env: ReturnType<typeof createTestDatabase>;
	beforeEach(() => jest.clearAllMocks());
	afterEach(() => env?.cleanup?.());

	it('stores the delivered tokens in the account the plugin reads from', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);

		await processManagedOAuthDelivery(corsair, {
			plugin: 'linear',
			tenantId: 'default',
			accessToken: 'lin_at',
			refreshToken: 'lin_rt',
			authType: 'oauth_2',
		});

		const km = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'linear',
			tenantId: 'default',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
		});
		expect(await km.get_access_token()).toBe('lin_at');
		expect(await km.get_refresh_token()).toBe('lin_rt');
	});

	it('forwards providerData to the resolver so token-body identity resolves', async () => {
		(resolveOAuthWebhookTenantLink as jest.Mock).mockResolvedValue(null);
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);

		await processManagedOAuthDelivery(corsair, {
			plugin: 'linear',
			tenantId: 'default',
			accessToken: 'lin_at',
			authType: 'oauth_2',
			providerData: { team: { id: 'T123' }, workspace_id: 'W1' },
		});

		expect(resolveOAuthWebhookTenantLink).toHaveBeenCalledWith(
			expect.anything(),
			'linear',
			expect.objectContaining({
				access_token: 'lin_at',
				team: { id: 'T123' },
				workspace_id: 'W1',
			}),
		);
	});

	it('registers the webhook tenant link under oauth_2, not managed', async () => {
		(resolveOAuthWebhookTenantLink as jest.Mock).mockResolvedValue({
			linkType: 'organization_id',
			externalId: 'org_1',
		});
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);

		await processManagedOAuthDelivery(corsair, {
			plugin: 'linear',
			tenantId: 'default',
			accessToken: 'lin_at',
			authType: 'oauth_2',
		});

		expect(setWebhookTenantLink).toHaveBeenCalledWith(
			expect.objectContaining({ authType: 'oauth_2' }),
		);
	});
});
