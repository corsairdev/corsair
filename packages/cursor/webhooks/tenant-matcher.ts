import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// The Cursor API does not define incoming webhook triggers for this integration.
export function matchCursorTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
