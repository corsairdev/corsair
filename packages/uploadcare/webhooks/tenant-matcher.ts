import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Uploadcare webhook payloads identify file and event metadata rather than account/tenant IDs.
// Routing uses the per-endpoint signing secret instead.
export function matchUploadcareTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}

