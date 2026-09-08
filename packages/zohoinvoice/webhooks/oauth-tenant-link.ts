import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import { zohoInvoiceApiBase } from '../client';

export async function resolveZohoInvoiceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.organization_id);
	if (externalId) {
		return { linkType: 'organization_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const tokenRecord = asRecord(tokens);
	const apiDomain =
		typeof tokenRecord?.api_domain === 'string'
			? tokenRecord.api_domain.replace(/\/$/, '')
			: zohoInvoiceApiBase();
	const response = await fetch(`${apiDomain}/invoice/v3/organizations`, {
		headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
	});
	if (!response.ok) return null;

	const payload = asRecord(await response.json());
	const organizations = Array.isArray(payload?.organizations)
		? payload.organizations
		: [];
	const organization = asRecord(organizations[0]);
	const organizationId = toExternalId(organization?.organization_id);
	return organizationId
		? { linkType: 'organization_id', externalId: organizationId }
		: null;
}
