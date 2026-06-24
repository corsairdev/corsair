import type { ConnectStatusResponse } from './contracts/connect-api';
import type {
	BuildConnectPluginManifestOptions,
	ConnectPluginManifestEntry,
} from './setup-introspect';
import { buildConnectPluginManifest } from './setup-introspect';

export type {
	ConnectAuthKind,
	ConnectStatusPluginEntry,
	ConnectStatusResponse,
} from './contracts/connect-api';

export async function getConnectStatusForTenant(
	corsair: unknown,
	tenantId: string,
	options: Pick<BuildConnectPluginManifestOptions, 'pluginIds'> = {},
): Promise<ConnectStatusResponse> {
	const manifest = await buildConnectPluginManifest(corsair, tenantId, {
		...options,
		skipOAuthUrlGeneration: true,
	});

	return {
		tenantId,
		plugins: manifest.map((entry: ConnectPluginManifestEntry) => ({
			plugin: entry.plugin,
			providerName: entry.providerName,
			authKind: entry.authKind,
			connected: entry.alreadyConfigured ?? false,
		})),
	};
}
