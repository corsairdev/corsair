import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCloseTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	let body = readBodyRecord(request);
	if (!body && typeof request.body === 'string') {
		try {
			body = JSON.parse(request.body) as Record<string, unknown>;
		} catch {
			body = null;
		}
	}
	if (!body) return null;

	const externalId = firstString([
		body.organization_id,
		asRecord(body.data)?.organization_id,
		body.tenant_external_id,
	]);

	if (!externalId) return null;

	return { linkType: 'organization_id', externalId };
}
