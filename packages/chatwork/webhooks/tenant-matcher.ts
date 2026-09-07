import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchChatworkTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const event = asRecord(body.webhook_event);
	const externalId = firstString([
		event?.account_id,
		event?.to_account_id,
		body.account_id,
	]);

	if (!externalId) return null;

	return { linkType: 'account_id', externalId };
}
