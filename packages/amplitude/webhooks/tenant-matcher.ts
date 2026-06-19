import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Amplitude destination webhooks are scoped to a single configured URL and
// authenticated via x-amplitude-signature (HMAC over the raw body). Payloads are
// customizable via FreeMarker templates and do not include a stable org/account
// identifier — see https://amplitude.com/docs/data/destination-catalog/webhooks
export function matchAmplitudeTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
