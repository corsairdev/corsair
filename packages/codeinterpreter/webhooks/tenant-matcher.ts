import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCodeInterpreterTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const sessionId = firstString([
		body.session_id,
		asRecord(body.data)?.session_id,
	]);
	const tenantExternalId = firstString([
		body.tenant_external_id,
		asRecord(body.data)?.tenant_external_id,
	]);
	const externalId = sessionId ?? tenantExternalId;

	if (!externalId) return null;

	return {
		linkType: sessionId ? 'session_id' : 'tenant_external_id',
		externalId,
	};
}
