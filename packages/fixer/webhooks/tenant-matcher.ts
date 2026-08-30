import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Fixer has no webhook delivery mechanism.
export function matchFixerTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
