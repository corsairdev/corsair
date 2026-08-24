import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/**
 * Mailtrap authenticates with a Personal Access Token and exposes no OAuth
 * flow for this catalog, so there is no token response to derive a routing
 * id from. Tenant linking is handled entirely by
 * `matchMailtrapTenantWebhook` instead.
 */
export async function resolveMailtrapOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
