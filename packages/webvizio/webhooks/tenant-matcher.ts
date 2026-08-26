import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Webvizio webhook payloads identify project/task events rather than a separate tenant account link.
// For API-key authenticated connections, routing uses the connection scope and webhook signing secret.
export function matchWebvizioTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
