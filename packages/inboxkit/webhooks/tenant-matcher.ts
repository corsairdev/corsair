import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Every InboxKit delivery names its team, the same uid account.get returns. Store
// it on the account as tenant_external_id to route deliveries to the right tenant.
export function matchInboxkitTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([body.team_id]);
	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
