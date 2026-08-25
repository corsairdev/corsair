import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// BART is a public REST API with no incoming webhooks
export function matchBartTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
