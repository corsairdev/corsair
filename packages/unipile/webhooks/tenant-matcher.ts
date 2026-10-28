import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Every Unipile event names the Unipile application it belongs to
// (application_id, app_…). One API key belongs to one application, so the
// application ID identifies the Corsair account that owns the key.
// https://developer.unipile.com/v2.0/reference/event-types-1#the-event-object
export function matchUnipileTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const applicationId = firstString([body.application_id]);
	if (!applicationId) return null;

	return { linkType: 'application_id', externalId: applicationId };
}
