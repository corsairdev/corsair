import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

export function matchTisaneTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
