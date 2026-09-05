import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// TODO: Rename linkType 'tenant_external_id' to match the provider field
// (e.g. team_id, installation_id, organization_id). Must match authConfig.account
// and oauthWebhookTenantLinkResolver.
// Return null for URL verification / handshake payloads that have no tenant id.
export function matchCloudflareApiKeyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	// TODO: Extract the stable external id from the webhook payload.
	// Example:
	// const externalId = firstString([body.tenant_external_id, asRecord(body.data)?.id]);
	const metadata = asRecord(body.metadata);
	const account = asRecord(metadata?.account);
	const data = asRecord(body.data);
	const externalId = firstString([
		body.account_id,
		account?.id,
		asRecord(data?.account)?.id,
	]);

	if (!externalId) return null;

	return { linkType: 'account_id', externalId };
}
