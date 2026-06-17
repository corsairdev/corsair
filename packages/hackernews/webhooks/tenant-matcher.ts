import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Hacker News is a public read-only API with no webhook delivery mechanism.
export function matchHackerNewsTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
