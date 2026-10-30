import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCoinbaseTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const user = asRecord(body.user);
	const account = asRecord(body.account);
	const data = asRecord(body.data);
	const userId = firstString([user?.id, data?.user_id]);
	if (userId) {
		return { linkType: 'user_id', externalId: userId };
	}

	const accountId = firstString([account?.id, data?.account]);
	if (accountId) {
		return { linkType: 'account', externalId: accountId };
	}

	return null;
}
