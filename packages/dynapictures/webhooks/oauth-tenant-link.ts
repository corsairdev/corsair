import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

/** DynaPictures does not support OAuth tenant linking for webhook routing in this plugin. */
export async function resolveDynapicturesOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): Promise<WebhookTenantMatch | undefined> {
	return undefined;
}
