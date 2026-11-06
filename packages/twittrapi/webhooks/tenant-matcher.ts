import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// TwittrAPI monitor events carry the watched account in `monitoredUserId`.
export function matchTwittrApiTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const tweet = asRecord(body.tweet);
	const author = asRecord(tweet?.author);

	const userId = firstString([
		body.monitoredUserId,
		tweet?.author_id,
		author?.id,
	]);

	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
