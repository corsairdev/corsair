import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCodeInterpreterTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.session_id,
		asRecord(body.data)?.session_id,
		body.tenant_external_id,
		asRecord(body.data)?.tenant_external_id,
	]);

	if (!externalId) return null;

	return { linkType: 'session_id', externalId };
}
