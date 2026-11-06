import type { CorsairPlugin } from '../core';
import type { TokenResponse } from '../core/auth/exchange';
import type { WebhookTenantLink } from './tenant-links';

/**
 * Calls the matching plugin's oauthWebhookTenantLinkResolver after OAuth and
 * normalizes to an array — most plugins yield one link, Slack yields the
 * workspace link plus a user-scoped one.
 */
export async function resolveOAuthWebhookTenantLink(
	plugins: readonly CorsairPlugin[],
	pluginId: string,
	tokens: TokenResponse,
): Promise<WebhookTenantLink[]> {
	for (const plugin of plugins) {
		if (plugin.id !== pluginId) continue;

		const resolver = plugin.oauthWebhookTenantLinkResolver;
		if (!resolver) return [];

		const result = await resolver(tokens);
		if (!result) return [];
		return Array.isArray(result) ? result : [result];
	}

	return [];
}
