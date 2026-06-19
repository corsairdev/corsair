import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Xquik webhooks are registered per API key and verified via X-Xquik-Signature.
// The optional username field identifies the monitored X account, not the Xquik
// API tenant — see https://docs.xquik.com/webhooks/overview
export function matchXquikTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
