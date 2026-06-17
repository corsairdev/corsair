import type { AllProviders } from '../constants';
import type {
	CorsairWebhookMatcher,
	CorsairWebhookTenantMatcher,
	RawWebhookRequest,
	WebhookTenantMatch,
} from './index';

export type PluginWebhookMatchers = {
	pluginWebhookMatcher?: CorsairWebhookMatcher;
	pluginTenantWebhookMatcher?: CorsairWebhookTenantMatcher;
};

export type WebhookPluginTenantMatch = {
	plugin: AllProviders | (string & {});
	tenantMatch: WebhookTenantMatch;
};

/**
 * Identifies which plugin an incoming webhook belongs to.
 */
export function matchWebhookPlugin(
	plugins: Record<string, PluginWebhookMatchers | undefined>,
	request: RawWebhookRequest,
): string | null {
	for (const [pluginId, plugin] of Object.entries(plugins)) {
		if (!plugin?.pluginWebhookMatcher) continue;
		if (plugin.pluginWebhookMatcher(request)) return pluginId;
	}
	return null;
}

/**
 * Runs plugin identification, then extracts the tenant lookup key for that plugin.
 */
export function matchWebhookPluginAndTenant(
	plugins: Record<string, PluginWebhookMatchers | undefined>,
	request: RawWebhookRequest,
): WebhookPluginTenantMatch | null {
	const pluginId = matchWebhookPlugin(plugins, request);
	if (!pluginId) return null;

	const plugin = plugins[pluginId];
	if (!plugin?.pluginTenantWebhookMatcher) return null;

	const tenantMatch = plugin.pluginTenantWebhookMatcher(request);
	if (!tenantMatch) return null;

	return { plugin: pluginId, tenantMatch };
}
