import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Delivery bodies carry a delivery id and an event. The workspace is resolved
// from the signing secret, not from a tenant id in the payload.
export function matchSaperlyTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
