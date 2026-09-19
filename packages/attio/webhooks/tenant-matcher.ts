import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchAttioTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const id = asRecord(body.id);
	const events = Array.isArray(body.events) ? body.events : [];
	const firstEvent = events.length > 0 ? asRecord(events[0]) : null;
	const firstEventId = firstEvent ? asRecord(firstEvent.id) : null;

	const externalId = firstString([
		id?.workspace_id,
		firstEventId?.workspace_id,
		body.workspace_id,
		asRecord(body.data)?.workspace_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
