import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchUnioneTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const users = body.events_by_user;
	const firstUser = Array.isArray(users) ? asRecord(users[0]) : undefined;
	const externalId = firstString([
		firstUser?.user_id,
		firstUser?.project_id,
		body.user_id,
	]);

	if (!externalId) return null;

	return { linkType: 'user_id', externalId };
}
