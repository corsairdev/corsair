import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Every Instantly delivery names its workspace (UUID), the same id
// workspace.get returns. Store it on the account as tenant_external_id to
// route deliveries to the right tenant.
export function matchInstantlyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([body.workspace]);
	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
