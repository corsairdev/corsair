import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Canny webhook payloads identify events, not the owning account.
// Routing uses the per-account API key / webhook signing secret.
// See https://developers.canny.io/api-reference#webhooks
export function matchCannyTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
