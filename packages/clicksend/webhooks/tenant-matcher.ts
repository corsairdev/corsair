import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchClickSendTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	const query = request.query as Record<string, string | undefined> | undefined;

	const username = firstString([
		query?.username,
		body?.username,
		asRecord(body?.data)?.username,
		body?.user_id ? String(body.user_id) : undefined,
	]);

	if (!username) return null;

	return { linkType: 'username', externalId: username };
}
