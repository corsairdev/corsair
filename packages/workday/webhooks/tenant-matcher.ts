import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchWorkdayTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.tenant_external_id,
		asRecord(body.data)?.tenant_external_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
