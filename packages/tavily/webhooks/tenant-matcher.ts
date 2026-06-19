import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Tavily does not expose incoming webhooks; tenant routing is not applicable.
export function matchTavilyTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
