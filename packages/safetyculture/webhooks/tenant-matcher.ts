import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// SafetyCulture webhooks are not yet implemented; tenant routing is not applicable.
export function matchSafetyCultureTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
