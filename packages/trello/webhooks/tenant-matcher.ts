import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Trello webhook payloads include the subscribed model on webhook.idModel and a
// snapshot of that resource on model.id (board, list, card, or member).
// See https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks
export function matchTrelloTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const idModel = firstString([
		asRecord(body.webhook)?.idModel,
		asRecord(body.model)?.id,
	]);
	if (!idModel) return null;

	return { linkType: 'idModel', externalId: idModel };
}
