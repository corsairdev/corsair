import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Reddit public API has no webhooks; Devvit server triggers include subredditId on events.
// See https://developers.reddit.com/docs/capabilities/server/triggers
export function matchRedditTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const subreddit = asRecord(body.subreddit);

	const subredditId = firstString([
		body.subredditId,
		body.subreddit_id,
		subreddit?.id,
	]);

	if (!subredditId) return null;

	return { linkType: 'subreddit_id', externalId: subredditId };
}
