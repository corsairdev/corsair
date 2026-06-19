import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, getHeader, readBodyRecord } from 'corsair/core';

// Zendesk event webhooks include account_id on the envelope and in
// x-zendesk-account-id. Trigger/automation payloads are custom and may omit it.
// See https://developer.zendesk.com/api-reference/webhooks/event-types/webhook-event-types/
export function matchZendeskTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const accountId = firstString([
		getHeader(request.headers, 'x-zendesk-account-id'),
		body.account_id,
	]);
	if (!accountId) return null;

	return { linkType: 'account_id', externalId: accountId };
}
