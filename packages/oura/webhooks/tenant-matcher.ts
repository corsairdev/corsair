import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Oura webhook callbacks include user_id for the subscribed ring owner.
// See https://cloud.ouraring.com/v2/docs
export function matchOuraTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const userId = firstString([body.user_id]);
	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
