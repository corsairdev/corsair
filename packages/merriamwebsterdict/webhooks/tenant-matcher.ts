import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Merriam-Webster has no webhook delivery mechanism.
export function matchMerriamWebsterDictTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
