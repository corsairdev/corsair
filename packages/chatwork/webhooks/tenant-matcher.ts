import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchChatworkTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const event = asRecord(body.webhook_event);
	const eventType = firstString([body.webhook_event_type]);
	const externalId = firstString([
		event?.to_account_id,
		body.account_id,
		eventType === 'mention_to_me' ? event?.account_id : undefined,
	]);

	if (!externalId) return null;

	return { linkType: 'account_id', externalId };
}
