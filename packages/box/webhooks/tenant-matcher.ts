import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Box webhook events identify the acting user on created_by and the
// subscribed webhook registration on webhook.id.
// See https://developer.box.com/guides/webhooks/v2/
export function matchBoxTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const webhookId = firstString([asRecord(body.webhook)?.id]);
	if (webhookId) {
		return { linkType: 'webhook_id', externalId: webhookId };
	}

	const userId = firstString([
		asRecord(body.created_by)?.id,
		asRecord(asRecord(body.source)?.owned_by)?.id,
	]);
	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
