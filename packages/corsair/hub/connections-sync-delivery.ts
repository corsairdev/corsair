import { listPlugins, listTenants } from '../core/management/operations';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import type { ConnectionsSyncManifest } from './sync-payload';
import { encryptSyncManifest } from './sync-payload';

export async function processConnectionsSyncDelivery(
	corsair: unknown,
	signingSecret: string,
): Promise<string> {
	const internal = getCorsairInternal(corsair);
	if (!internal.database) {
		throw new Error(
			'A database must be configured to sync connections from the app',
		);
	}

	await setupCorsair(corsair as Parameters<typeof setupCorsair>[0], {
		silent: true,
	});

	const [tenants, plugins] = await Promise.all([
		listTenants(internal),
		listPlugins(internal),
	]);

	const manifest: ConnectionsSyncManifest = {
		tenants: tenants.map((tenant) => ({ id: tenant.id })),
		plugins: plugins.map((plugin) => ({
			id: plugin.id,
			authType: plugin.authType,
			configured: plugin.configured,
			missingFields: plugin.missingFields,
		})),
		syncedAt: new Date().toISOString(),
	};

	return encryptSyncManifest(manifest, signingSecret);
}
