import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Issue #744: no inbound webhooks. Tenant routing is not applicable.
export function matchTwoChatTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
