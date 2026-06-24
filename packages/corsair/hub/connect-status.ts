import { formatProviderDisplayName } from '../core/constants';
import type { AuthTypes } from '../core/constants';
import { getConnectionStatus } from '../core/management/operations';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getPluginAuthType } from '../core/utils/plugin-auth';
import type { ConnectStatusResponse } from './contracts/connect-api';
import type { ConnectAuthKind } from './contracts/connect-api';

export type {
	ConnectAuthKind,
	ConnectStatusPluginEntry,
	ConnectStatusResponse,
} from './contracts/connect-api';

function toConnectAuthKind(authType: AuthTypes): ConnectAuthKind {
	if (authType === 'oauth_2' || authType === 'managed') {
		return 'oauth';
	}
	if (authType === 'bot_token') {
		return 'bot_token';
	}
	return 'api_key';
}

function shouldIncludePlugin(
	plugin: CorsairPlugin,
	pluginIdFilter: Set<string> | null,
): boolean {
	if (pluginIdFilter && !pluginIdFilter.has(plugin.id)) {
		return false;
	}
	return getPluginAuthType(plugin) !== null;
}

export async function getConnectStatusForTenant(
	corsair: unknown,
	tenantId: string,
	options: { pluginIds?: string[] } = {},
): Promise<ConnectStatusResponse> {
	const internal = getCorsairInternal(corsair);
	const effectiveTenantId = tenantId.trim() || 'default';
	const pluginIdFilter = options.pluginIds?.length
		? new Set(options.pluginIds)
		: null;

	const connectionStatus = await getConnectionStatus(
		internal,
		effectiveTenantId,
	);

	const plugins = internal.plugins
		.filter((plugin) => shouldIncludePlugin(plugin, pluginIdFilter))
		.map((plugin) => {
			const authType = getPluginAuthType(plugin)!;
			const status = connectionStatus[plugin.id] ?? 'not_connected';

			return {
				plugin: plugin.id,
				providerName: formatProviderDisplayName(plugin.id),
				authKind: toConnectAuthKind(authType),
				connected: status === 'connected',
			};
		});

	return {
		tenantId: effectiveTenantId,
		plugins,
	};
}
