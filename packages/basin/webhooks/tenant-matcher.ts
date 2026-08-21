import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Basin is configured as a REST-only integration with no incoming webhook events.
export function matchBasinTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
