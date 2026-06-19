import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Todoist webhook payloads include user_id for the account that owns the webhook.
// See https://developer.todoist.com/api/v1/#webhooks
export function matchTodoistTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const userId = firstString([body.user_id]);
	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
