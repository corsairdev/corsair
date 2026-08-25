import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Matches the webhook tenant by extracting the stable tenant identifier from the payload.
 * Looks for tenant_external_id first, falls back to data.id which is always present in ExampleEvent.
 * This ID uniquely identifies the account/team and must match the OAuth token's tenant_external_id.
 */
export function matchBrandfetchTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.tenant_external_id,
		asRecord(body.data)?.id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
