import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCoinbaseTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const user = asRecord(body.user);
	const userId = firstString([user?.id, asRecord(body.data)?.user_id]);
	if (userId) {
		return { linkType: 'user_id', externalId: userId };
	}

	return null;
}
