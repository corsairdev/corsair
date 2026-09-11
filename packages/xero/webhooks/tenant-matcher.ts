import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

export function matchXeroTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	let tenantId: string | undefined;

	if (Array.isArray(body.events) && body.events.length > 0) {
		const first = body.events[0];
		if (first && typeof first === 'object' && 'tenantId' in first) {
			tenantId = firstString([first.tenantId]);
		}
	}

	if (!tenantId) {
		tenantId = firstString([body.tenantId, body.tenant_id]);
	}

	if (!tenantId) return null;

	return { linkType: 'tenant_external_id', externalId: tenantId };
}
