import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Figma webhook payloads include webhook_id on every event (including PING).
// See https://developers.figma.com/docs/rest-api/webhooks-events/
export function matchFigmaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const webhookId = firstString([body.webhook_id]);
	if (!webhookId) return null;

	return { linkType: 'webhook_id', externalId: webhookId };
}
