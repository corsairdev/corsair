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

import { processAuthCredentialsDelivery } from '../hub/credentials-delivery';
import { reportPluginConnectionStatus } from '../hub/report-connection-status';

const KEK = 'test-kek-credentials-delivery';

const slackApiKey = {
	id: 'slack',
	options: { authType: 'api_key' as const },
	authConfig: {
		api_key: {
			account: ['team_id'] as const,
		},
	},
} as unknown as CorsairPlugin;

describe('processAuthCredentialsDelivery', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => {
		(reportPluginConnectionStatus as jest.Mock).mockClear();
		env?.cleanup?.();
	});

	it('stores the credential and acks connected back to Hub', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackApiKey],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		await processAuthCredentialsDelivery(corsair, {
			plugin: 'slack',
			tenantId: 'default',
			credentials: { api_key: 'xoxb-delivered' },
		});

		// Credential landed in the vault (connected true even with team_id missing).
		const status = await getPluginAuthStatus(
			getCorsairInternal(corsair),
			slackApiKey,
			'default',
		);
		expect(status?.connected).toBe(true);

		// And the delivery reported that connection state to Hub — without it the
		// dashboard grid and list_connections never flip to connected.
		expect(reportPluginConnectionStatus).toHaveBeenCalledTimes(1);
		const [, arg] = (reportPluginConnectionStatus as jest.Mock).mock.calls[0];
		expect(arg.tenantId).toBe('default');
		expect(arg.plugin.id).toBe('slack');
	});

	it('does not ack when no credential field is stored', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackApiKey],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);

		await expect(
			processAuthCredentialsDelivery(corsair, {
				plugin: 'slack',
				tenantId: 'default',
				credentials: { api_key: '   ' },
			}),
		).rejects.toThrow();

		expect(reportPluginConnectionStatus).not.toHaveBeenCalled();
	});
});
