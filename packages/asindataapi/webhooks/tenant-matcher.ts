import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

/**
 * ASIN Data API webhooks do not contain a tenant identifier in their
 * payload. The webhook is scoped to the account-level notification URL.
 * Return null to skip tenant matching.
 */
export function matchAsinDataApiTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
