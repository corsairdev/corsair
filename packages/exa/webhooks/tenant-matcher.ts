import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Exa webhooks are authenticated per endpoint via Exa-Signature / x-exa-signature
// (HMAC-SHA256). Payloads describe events (websets, monitors, etc.) but do not
// include an account or org identifier — see
// https://exa.ai/docs/websets/api/webhooks/verifying-signatures
export function matchExaTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
