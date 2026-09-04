import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCoinbaseTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const user = asRecord(body.user);
	const account = asRecord(body.account);
	const externalId = firstString([
		user?.id,
		account?.id,
		asRecord(body.data)?.user_id,
	]);

	if (!externalId) return null;

	return { linkType: 'user_id', externalId };
}
