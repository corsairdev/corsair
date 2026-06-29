import { ensureTenantProvisioned } from '../../core/tenant-provision';
import { getCorsairInternal } from '../../core/utils/corsair-instance';
import { setupCorsair } from '../../setup';

// Ensures integration rows and DEKs exist without tenant-scoped account provisioning.
export async function ensureCorsairIntegrationProvisioned(
	corsair: unknown,
): Promise<void> {
	const internal = getCorsairInternal(corsair);
	if (!internal.database) {
		throw new Error(
			'A database must be configured to provision Corsair integrations',
		);
	}

	await setupCorsair(corsair as Parameters<typeof setupCorsair>[0], {
		silent: true,
	});
}

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

	await ensureTenantProvisioned(internal, tenantId);
}
