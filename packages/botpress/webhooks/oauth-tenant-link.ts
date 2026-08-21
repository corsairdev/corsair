import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/**
 * Botpress authenticates with a Personal Access Token and exposes no OAuth
 * flow for this catalog, so there is no token response to derive a routing
 * id from. Tenant linking is handled entirely by
 * `matchBotpressTenantWebhook` instead.
 */
export async function resolveBotpressOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
