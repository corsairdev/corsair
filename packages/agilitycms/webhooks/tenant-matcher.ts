import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

export function matchAgilityCmsTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);

	if (!body) {
		return null;
	}

	const externalId = firstString([body.instanceGuid]);

	if (!externalId) {
		return null;
	}

	return {
		linkType: 'tenant_external_id',
		externalId,
	};
}
