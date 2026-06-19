import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// AT Protocol has no native webhooks; relay services forward repo events with a repo DID.
// See https://atproto.com/specs/sync#firehose
export function matchBlueskyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const commit = asRecord(body.commit);

	const did = firstString([body.did, body.repo, commit?.repo]);
	if (!did) return null;

	return { linkType: 'did', externalId: did };
}
