import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Cal.com booking webhooks nest data under payload; MEETING_STARTED uses a flat
// envelope with top-level userId and organizationId.
// See https://cal.com/docs/developing/guides/automation/webhooks
export function matchCalTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const payload = asRecord(body.payload) ?? body;

	const organizationId = firstString([
		body.organizationId,
		payload.organizationId,
	]);
	if (organizationId) {
		return { linkType: 'organization_id', externalId: organizationId };
	}

	const userId = firstString([
		body.userId,
		payload.userId,
		asRecord(payload.organizer)?.id,
		asRecord(payload.user)?.id,
	]);
	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
