import type { CorsairInternalConfig } from './index';

const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

const inflightByTenant = new Map<string, Promise<void>>();

function createSetupShim(internal: CorsairInternalConfig): object {
	if (internal.multiTenancy) {
		return {
			withTenant: () => ({}),
			[CORSAIR_INTERNAL]: internal,
		};
	}

	return {
		[CORSAIR_INTERNAL]: internal,
	};
}

// Lazily provisions integration + account rows for a tenant (multi-tenant) or default.
export async function ensureTenantProvisioned(
	internal: CorsairInternalConfig,
	tenantId: string,
): Promise<void> {
	if (!internal.database) {
		return;
	}

	const normalizedTenantId = tenantId.trim() || 'default';
	const inflightKey = `${internal.multiTenancy}:${normalizedTenantId}`;
	const existing = inflightByTenant.get(inflightKey);
	if (existing) {
		await existing;
		return;
	}

	const task = (async () => {
		const { setupCorsair } = await import('../setup/index.js');
		await setupCorsair(
			createSetupShim(internal) as Parameters<typeof setupCorsair>[0],
			{
				tenantId: internal.multiTenancy ? normalizedTenantId : undefined,
				silent: true,
			},
		);
	})().finally(() => {
		inflightByTenant.delete(inflightKey);
	});

	inflightByTenant.set(inflightKey, task);
	await task;
}
