import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchPDFMonkeyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const document = asRecord(body.document);
	const externalId = firstString([document?.app_id, body.app_id]);
	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
