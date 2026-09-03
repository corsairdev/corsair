import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

/** Botbaba registers no inbound webhook handlers. */
export function matchBotbabaTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
