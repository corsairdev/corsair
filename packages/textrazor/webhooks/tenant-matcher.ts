import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// TODO: Rename linkType 'tenant_external_id' to match the provider field
// (e.g. team_id, installation_id, organization_id). Must match authConfig.account
// and oauthWebhookTenantLinkResolver.
// Return null for URL verification / handshake payloads that have no tenant id.
export function matchTextrazorTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	// TODO: Extract the stable external id from the webhook payload.
	// Example:
	// const externalId = firstString([body.tenant_external_id, asRecord(body.data)?.id]);
	const externalId = firstString([
		body.tenant_external_id,
		asRecord(body.data)?.tenant_external_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
