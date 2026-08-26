import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Dictionary has no webhook delivery mechanism.
export function matchDictionaryTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
