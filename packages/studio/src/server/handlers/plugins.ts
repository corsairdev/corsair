import type {
	AuthTypes,
	CorsairPlugin,
	OAuthConfig,
	PluginAuthConfig,
} from 'corsair/core';
import type { HandlerFn } from '../types';
import { getAuthFieldStatus } from './credentials-internal';

function getAuthType(plugin: CorsairPlugin): AuthTypes | undefined {
	return (plugin.options as Record<string, unknown> | undefined)?.authType as
		| AuthTypes
		| undefined;
}

function getOAuthConfig(plugin: CorsairPlugin): OAuthConfig | null {
	return (plugin as { oauthConfig?: OAuthConfig }).oauthConfig ?? null;
}

function getCustomFields(
	plugin: CorsairPlugin,
	authType: AuthTypes,
): { integration: readonly string[]; account: readonly string[] } {
	const authConfig = plugin.authConfig as PluginAuthConfig | undefined;
	const entry = authConfig?.[authType];
	return {
		integration: entry?.integration ?? [],
		account: entry?.account ?? [],
	};
}

export const listPlugins: HandlerFn = async (ctx) => {
	const { internal, instance, resolveClient } = await ctx.getCorsair();
	const tenantId = ctx.url.searchParams.get('tenant') ?? 'default';
	const scope =
		ctx.url.searchParams.get('scope') === 'main' ? 'main' : 'tenant';
	const client = resolveClient(tenantId);
	const rootKeys = ((instance as Record<string, unknown>).keys ??
		null) as Record<string, unknown> | null;

	const result = [] as Array<{
		id: string;
		authType: AuthTypes | 'none';
		authed: boolean;
		requiredFields: Array<{
			name: string;
			level: 'integration' | 'account';
			set: boolean;
		}>;
		oauth: {
			available: boolean;
			scopes: readonly string[];
			providerName: string | null;
		} | null;
	}>;

	for (const plugin of internal.plugins) {
		const authType = getAuthType(plugin);
		const oauth = getOAuthConfig(plugin);
		const custom = authType
			? getCustomFields(plugin, authType)
			: { integration: [], account: [] };
		const integrationNamespace = (rootKeys?.[plugin.id] ?? null) as Record<
			string,
			unknown
		> | null;
		const pluginNamespace = (client[plugin.id] ?? null) as Record<
			string,
			unknown
		> | null;
		const accountNamespace = (pluginNamespace?.keys ?? null) as Record<
			string,
			unknown
		> | null;
		const status = await getAuthFieldStatus({
			authType,
			extraIntegration: custom.integration,
			extraAccount: custom.account,
			integrationNamespace,
			accountNamespace,
			includeIntegration: true,
			includeAccount: scope !== 'main',
		});
		result.push({
			id: plugin.id,
			authType: authType ?? 'none',
			authed: status.every((s) => s.set),
			requiredFields: status,
			oauth: oauth
				? {
						available: true,
						scopes: oauth.scopes,
						providerName: oauth.providerName ?? null,
					}
				: null,
		});
	}

	return result;
};
