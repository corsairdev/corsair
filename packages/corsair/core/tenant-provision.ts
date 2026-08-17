import type { CorsairDatabase } from '../db/kysely/database';
import type { CorsairInternalConfig } from './index';
import type { CorsairPlugin } from './plugins';

const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

const inflightByDatabase = new WeakMap<
	CorsairDatabase,
	Map<string, Promise<void>>
>();

const inflightByConfig = new WeakMap<
	CorsairInternalConfig,
	Map<string, Promise<void>>
>();

function buildInflightKey(
	tenantId: string,
	plugins: readonly CorsairPlugin[],
): string {
	const pluginScope = plugins
		.map((plugin) => plugin.id)
		.sort()
		.join('\0');
	return `${tenantId}\0${pluginScope}`;
}

function getInflightMap(
	internal: CorsairInternalConfig,
): Map<string, Promise<void>> {
	if (internal.database) {
		let inflightByScope = inflightByDatabase.get(internal.database);
		if (!inflightByScope) {
			inflightByScope = new Map();
			inflightByDatabase.set(internal.database, inflightByScope);
		}
		return inflightByScope;
	}

	let inflightByScope = inflightByConfig.get(internal);
	if (!inflightByScope) {
		inflightByScope = new Map();
		inflightByConfig.set(internal, inflightByScope);
	}
	return inflightByScope;
}

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
	const inflightByTenant = getInflightMap(internal);
	const inflightKey = buildInflightKey(normalizedTenantId, internal.plugins);
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
