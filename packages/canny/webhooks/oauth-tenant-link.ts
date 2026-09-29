import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

// Canny uses account API keys and does not use OAuth tenant linking.
export async function resolveCannyOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	return null;
}
