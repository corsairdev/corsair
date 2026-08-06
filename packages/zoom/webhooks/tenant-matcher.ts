import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Zoom event notifications include payload.account_id. URL validation
// challenges cannot be mapped to a tenant.
// See https://developers.zoom.us/docs/api/webhooks/
export function matchZoomTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (body.event === 'endpoint.url_validation') return null;

	const payload = asRecord(body.payload);
	const accountId = firstString([payload?.account_id]);
	if (!accountId) return null;

	return { linkType: 'account_id', externalId: accountId };
}
