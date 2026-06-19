import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Resend webhook payloads identify events, not the owning account. Routing uses
// the per-endpoint signing secret instead.
// See https://resend.com/docs/webhooks/verify-webhooks-requests
export function matchResendTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
