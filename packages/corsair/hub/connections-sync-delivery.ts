import { listPlugins, listTenants } from '../core/management/operations';
import {
	getCorsairInternal,
	InvalidCorsairInstanceError,
} from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import type { ConnectionsSyncManifest } from './sync-payload';
import { encryptSyncManifest } from './sync-payload';

const NON_RETRYABLE_SYNC_FRAGMENTS = [
	'invalid corsair instance',
	'a database must be configured to sync connections from the app',
	'a database must be configured on the corsair instance',
	'signing secret is required to encrypt sync manifest',
] as const;

export function isConnectionsSyncRetryableError(error: unknown): boolean {
	if (error instanceof InvalidCorsairInstanceError) {
		return false;
	}

	if (!(error instanceof Error)) {
		return true;
	}

	const message = error.message.toLowerCase();
	return !NON_RETRYABLE_SYNC_FRAGMENTS.some((fragment) =>
		message.includes(fragment),
	);
}

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
