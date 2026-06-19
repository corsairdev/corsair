import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Linear webhook payloads include organizationId on every event envelope.
// See https://developers.linear.app/docs/graphql/webhooks
export function matchLinearTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const organizationId = firstString([body.organizationId]);
	if (!organizationId) return null;

	return { linkType: 'organization_id', externalId: organizationId };
}
