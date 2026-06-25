import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Airtable webhook notification pings include the base id; full change payloads
// are fetched separately via the Webhooks API.
// See https://airtable.com/developers/web/api/webhooks-overview
export function matchAirtableTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const baseId = firstString([asRecord(body.base)?.id]);
	if (!baseId) return null;

	return { linkType: 'base_id', externalId: baseId };
}
