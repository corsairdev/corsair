import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

/**
 * Ashby webhook payloads identify events and specific entity IDs, not the owning tenant account ID.
 * Webhook routing is based on the per-endpoint signing secret.
 */
export function matchAshbyTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
