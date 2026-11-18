import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import type { ZohoInvoiceRegion } from '../client';
import { zohoInvoiceApiBase } from '../client';

/**
 * After OAuth, saves the default organization's id as the account's
 * `organization_id`, so calls can leave organizationId out. Uses the
 * token's api_domain when Zoho sends one (it names the data center),
 * else the configured region.
 */
export async function resolveZohoInvoiceOAuthWebhookTenantLink(
	tokens: TokenResponse,
	region?: ZohoInvoiceRegion,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.organization_id);
	if (externalId) {
		return { linkType: 'organization_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const rawDomain =
			typeof tokens.api_domain === 'string' &&
			/^https:\/\/www\.zohoapis\.[a-z.]+\/?$/.test(tokens.api_domain)
				? tokens.api_domain
				: undefined;
		const base = rawDomain
			? `${rawDomain.replace(/\/$/, '')}/invoice/v3`
			: zohoInvoiceApiBase(region);
		const response = await fetch(`${base}/organizations`, {
			headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
		});
		if (!response.ok) return null;

		const payload = asRecord(await response.json());
		const organizations = Array.isArray(payload?.organizations)
			? payload.organizations
			: [];
		const defaultOrganizations = organizations.filter(
			(org) => asRecord(org)?.is_default_org === true,
		);
		if (defaultOrganizations.length !== 1) return null;

		const organization = asRecord(defaultOrganizations[0]);
		const organizationId = toExternalId(organization?.organization_id);
		return organizationId
			? { linkType: 'organization_id', externalId: organizationId }
			: null;
	} catch {
		return null;
	}
}
