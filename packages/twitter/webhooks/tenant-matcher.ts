import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// X Account Activity API: for_user_id identifies the subscribed user on the envelope.
// See https://developer.x.com/en/docs/x-api/account-activity/guides/account-activity-data-sources
export function matchTwitterTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	// CRC and other non-event payloads do not include a resolvable tenant id.
	if ('crc_token' in body || 'response_token' in body) return null;

	const forUserId = firstString([body.for_user_id]);
	if (!forUserId) return null;

	return { linkType: 'for_user_id', externalId: forUserId };
}
