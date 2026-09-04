import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

export function matchWhautomateTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
