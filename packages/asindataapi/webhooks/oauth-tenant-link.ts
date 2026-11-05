import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/**
 * ASIN Data API uses API key authentication only (no OAuth).
 * This resolver is a no-op.
 */
export async function resolveAsinDataApiOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
