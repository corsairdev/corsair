import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Bannerbear webhook payloads contain the completed resource objects (e.g. image, video)
// rather than an owning account ID. Routing uses the per-webhook URL configured
// at the project level or per-request callback URL.
// See https://developers.bannerbear.com/v5/#webhooks
export function matchBannerbearTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
