import { createCorsair } from '../core';
import { getPluginAuthStatus } from '../core/auth/plugin-auth-status';
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

import { processManagedOAuthDelivery } from '../hub/managed-oauth';
import { reportPluginConnectionStatus } from '../hub/report-connection-status';
import { subscribeAndReport } from '../oauth/subscribe-report';

const KEK = 'test-kek-managed-oauth';

const githubManaged = {
	id: 'github',
	options: { authType: 'managed' as const },
	authConfig: {
		managed: {
			account: ['installation_id'] as const,
		},
	},
} as unknown as CorsairPlugin;

describe('processManagedOAuthDelivery', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => {
		(reportPluginConnectionStatus as jest.Mock).mockClear();
		(subscribeAndReport as jest.Mock).mockClear();
		env?.cleanup?.();
	});

	it('stores the token and acks connected back to Hub without a webhook link', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [githubManaged],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		await processManagedOAuthDelivery(corsair, {
			plugin: 'github',
			tenantId: 'default',
			accessToken: 'gho_delivered',
			refreshToken: 'ghr_delivered',
		});

		// Token landed in the vault (connected even with installation_id missing).
		const status = await getPluginAuthStatus(
			getCorsairInternal(corsair),
			githubManaged,
			'default',
		);
		expect(status?.connected).toBe(true);

		// And the delivery acked connection state to Hub — github has no resolvable
		// webhook link here, so without the base ack the grid would never flip.
		expect(reportPluginConnectionStatus).toHaveBeenCalledTimes(1);
		const [, arg] = (reportPluginConnectionStatus as jest.Mock).mock.calls[0];
		expect(arg.tenantId).toBe('default');
		expect(arg.plugin.id).toBe('github');
	});

	it('arms the provider subscription after storing the token', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [githubManaged],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		await processManagedOAuthDelivery(corsair, {
			plugin: 'github',
			tenantId: 'default',
			accessToken: 'gho_delivered',
			refreshToken: 'ghr_delivered',
		});

		expect(subscribeAndReport).toHaveBeenCalledTimes(1);
		const [, plugin, tenantId] = (subscribeAndReport as jest.Mock).mock
			.calls[0];
		expect(plugin.id).toBe('github');
		expect(tenantId).toBe('default');
	});

	it('a failing subscribe does not break the delivery', async () => {
		env = createTestDatabase();
		(subscribeAndReport as jest.Mock).mockRejectedValueOnce(
			new Error('graph down'),
		);
		const corsair = createCorsair({
			plugins: [githubManaged],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		await expect(
			processManagedOAuthDelivery(corsair, {
				plugin: 'github',
				tenantId: 'default',
				accessToken: 'gho_delivered',
			}),
		).resolves.toEqual({ plugin: 'github', tenantId: 'default' });
	});
});
