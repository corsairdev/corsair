import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/**
 * Botbaba authenticates with an API key and exposes no OAuth flow for this
 * catalog, so there is no token response to derive a routing id from.
 * Tenant linking is handled entirely by `matchBotbabaTenantWebhook` instead.
 */
export async function resolveBotbabaOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
