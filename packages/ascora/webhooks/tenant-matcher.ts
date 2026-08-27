import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

export function matchAscoraTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
