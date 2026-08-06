import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Strava push events include owner_id (athlete id) on activity/athlete webhooks.
// See https://developers.strava.com/docs/webhooks/
export function matchStravaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const ownerId = firstString([body.owner_id]);
	if (!ownerId) return null;

	return { linkType: 'owner_id', externalId: ownerId };
}
