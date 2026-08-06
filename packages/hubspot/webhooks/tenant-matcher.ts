import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';

function hubspotEvents(body: unknown): Record<string, unknown>[] {
	if (Array.isArray(body)) {
		return body.filter(
			(event): event is Record<string, unknown> =>
				event !== null && typeof event === 'object' && !Array.isArray(event),
		);
	}

	const record = asRecord(body);
	return record ? [record] : [];
}

// HubSpot subscription notifications include portalId on each event object.
// See https://developers.hubspot.com/docs/api/webhooks
export function matchHubspotTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const events = hubspotEvents(request.body);
	if (events.length === 0) return null;

	const portalId = firstString(events.map((event) => event.portalId));
	if (!portalId) return null;

	return { linkType: 'portal_id', externalId: portalId };
}
