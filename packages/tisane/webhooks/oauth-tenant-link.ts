import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

export async function resolveTisaneOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
