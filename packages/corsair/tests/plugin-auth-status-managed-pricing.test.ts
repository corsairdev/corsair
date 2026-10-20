import { createCorsair } from '../core';
import { getPluginAuthStatus } from '../core/auth/plugin-auth-status';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-managed-pricing';

const firecrawlManagedPricing = {
	id: 'firecrawl',
	options: { authType: 'managed_pricing' as const },
} as unknown as CorsairPlugin;

describe('getPluginAuthStatus — managed_pricing', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('reports ready without integration or account credentials', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [firecrawlManagedPricing],
			database: env.db,
			kek: KEK,
		} as any);

		await setupCorsair(corsair);

		const status = await getPluginAuthStatus(
			getCorsairInternal(corsair),
			firecrawlManagedPricing,
			'default',
		);

		expect(status?.authType).toBe('managed_pricing');
		expect(status?.status).toBe('ready');
		expect(status?.connected).toBe(true);
		expect(status?.missingRequiredFields).toEqual([]);
	});
});
