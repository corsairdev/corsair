import type { CorsairPlugin } from '../core';
import type { TokenResponse } from '../core/auth/exchange';
import type { WebhookTenantLink } from './tenant-links';

/**
 * Calls the matching plugin's oauthWebhookTenantLinkResolver after OAuth.
 */
export async function resolveOAuthWebhookTenantLink(
	plugins: readonly CorsairPlugin[],
	pluginId: string,
	tokens: TokenResponse,
): Promise<WebhookTenantLink | null> {
	for (const plugin of plugins) {
		if (plugin.id !== pluginId) continue;

		const resolver = plugin.oauthWebhookTenantLinkResolver;
		if (!resolver) return null;

		return resolver(tokens);
	}

	return null;
}
