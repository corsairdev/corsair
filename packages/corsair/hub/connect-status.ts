import {
	getPluginAuthStatusForTenant,
	mapPluginAuthStatusToConnectionState,
} from '../core/auth/plugin-auth-status';
import type { AuthTypes } from '../core/constants';
import { formatProviderDisplayName } from '../core/constants';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getPluginAuthType } from '../core/utils/plugin-auth';
import type {
	ConnectAuthKind,
	ConnectStatusResponse,
} from './contracts/connect-api';

export type {
	ConnectAuthFieldStatus,
	ConnectAuthKind,
	ConnectAuthStatusLevel,
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

	const authStatuses = await getPluginAuthStatusForTenant(
		internal,
		effectiveTenantId,
		{ pluginIds: options.pluginIds },
	);
	const authStatusByPlugin = new Map(
		authStatuses.map((entry) => [entry.plugin, entry]),
	);

	const plugins = internal.plugins
		.filter((plugin) => shouldIncludePlugin(plugin, pluginIdFilter))
		.map((plugin) => {
			const authType = getPluginAuthType(plugin)!;
			const authStatus = authStatusByPlugin.get(plugin.id);

			if (!authStatus) {
				return {
					plugin: plugin.id,
					providerName: formatProviderDisplayName(plugin.id),
					authKind: toConnectAuthKind(authType),
					status: 'not_started' as const,
					connected: false,
					fields: [],
					missingRequiredFields: [],
				};
			}

			return {
				plugin: plugin.id,
				providerName: formatProviderDisplayName(plugin.id),
				authKind: toConnectAuthKind(authType),
				status: authStatus.status,
				connected: authStatus.connected,
				fields: authStatus.fields.map((field) => ({
					name: field.name,
					level: field.level,
					required: field.required,
					configured: field.configured,
				})),
				missingRequiredFields: authStatus.missingRequiredFields,
			};
		});

	return {
		tenantId: effectiveTenantId,
		plugins,
	};
}

export { mapPluginAuthStatusToConnectionState };
