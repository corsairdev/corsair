import { isOptionalAuthField } from '../core/auth/plugin-auth-status';
import type { PluginAuthConfig } from '../core/auth/types';
import { listPlugins, listTenants } from '../core/management/operations';
import type { CorsairPlugin } from '../core/plugins';
import {
	getCorsairInternal,
	InvalidCorsairInstanceError,
} from '../core/utils/corsair-instance';
import { getPluginAuthType } from '../core/utils/plugin-auth';
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

/**
 * Integration-level extension fields (beyond client credentials) that the
 * CUSTOMER must supply — e.g. gmail's topic_id. Surfaced to the hub grid via
 * the sync manifest; never shown on tenant-facing connect pages.
 */
export function getExtraIntegrationCredentialFields(
	plugin: CorsairPlugin | undefined,
): string[] {
	if (!plugin) return [];
	const authType = getPluginAuthType(plugin);
	if (!authType) return [];
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	return (authConfig?.[authType]?.integration ?? []).filter(
		(field) => !isOptionalAuthField(field),
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
		plugins: plugins.map((plugin) => {
			const extras = getExtraIntegrationCredentialFields(
				internal.plugins.find((p) => p.id === plugin.id),
			);
			return {
				id: plugin.id,
				authType: plugin.authType,
				configured: plugin.configured,
				missingFields: plugin.missingFields,
				...(extras.length > 0 ? { integrationCredentialFields: extras } : {}),
			};
		}),
		syncedAt: new Date().toISOString(),
	};

	return encryptSyncManifest(manifest, signingSecret);
}
