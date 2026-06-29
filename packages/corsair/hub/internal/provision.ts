import { getCorsairInternal } from '../../core/utils/corsair-instance';
import { setupCorsair } from '../../setup';

// Ensures integration + account rows exist for every configured plugin.
export async function ensureCorsairProvisionedForTenant(
	corsair: unknown,
	tenantId: string,
): Promise<void> {
	const internal = getCorsairInternal(corsair);
	if (!internal.database) {
		throw new Error(
			'A database must be configured to provision Corsair for connect',
		);
	}

	await setupCorsair(corsair as Parameters<typeof setupCorsair>[0], {
		tenantId,
		silent: true,
	});
}
