import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Scale AI delivers task/batch completion updates via one-way `callback_url`
// callbacks, not signed tenant-scoped webhooks. Tenant routing is not applicable.
export function matchScaleAiTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
