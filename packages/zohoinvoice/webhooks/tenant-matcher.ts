import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchZohoInvoiceTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.organization_id,
		asRecord(body.data)?.organization_id,
	]);

	if (!externalId) return null;

	return { linkType: 'organization_id', externalId };
}
