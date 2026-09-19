import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/**
 * College Football Data authenticates with a single API key and has no
 * OAuth flow at all, so there is no token response to derive a routing id
 * from. The provider's API also has no webhook capability whatsoever
 * (confirmed: no webhook path or tag anywhere in the official OpenAPI
 * document's 74 operations) - see `matchCollegeFootballDataTenantWebhook`.
 */
export async function resolveCollegeFootballDataOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
