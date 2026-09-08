import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

export function matchBannerbearTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
