import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// twitterapi.io webhook payloads include userId on tweet.created / tweet.filter_match events.
export function matchTwitterApiIOTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const data = asRecord(body.data);
	const user = asRecord(data?.user);
	const tweet = asRecord(data?.tweet);
	const author = asRecord(tweet?.author);

	const userId = firstString([
		body.userId,
		user?.id,
		author?.id,
		tweet?.author_id,
	]);

	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
