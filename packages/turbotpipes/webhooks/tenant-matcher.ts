import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

export function matchTurbotPipesTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
