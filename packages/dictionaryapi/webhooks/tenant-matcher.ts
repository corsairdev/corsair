import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Merriam-Webster has no webhook delivery mechanism.
export function matchDictionaryApiTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
