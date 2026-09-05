import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/**
 * Benzinga authenticates with API keys only
 * (https://docs.benzinga.com/api-reference/authentication), so there is no
 * OAuth exchange and no token response to derive a tenant link from.
 * Returning null records that decision explicitly.
 */
export async function resolveBenzingaOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	void tokens;
	return null;
}
