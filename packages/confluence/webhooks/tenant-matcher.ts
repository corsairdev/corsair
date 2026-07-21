import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Atlassian Cloud webhook payloads don't carry a stable tenant id on the
// envelope; routing is done via the `X-Atlassian-Webhook-Identifier` header
// and the cloud URL on the account. For now we surface the fields we know
// about and return null for handshake/example payloads that have no tenant.
// Ref: https://developer.atlassian.com/cloud/jira/platform/webhooks/
export function matchConfluenceTenantWebhook(
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
