import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import type { ZohoInvoiceRegion } from '../client';
import { zohoInvoiceApiBase } from '../client';

/**
 * After OAuth, saves the default organization's id as the account's
 * `organization_id`, so calls can leave organizationId out. Looks the org up
 * in the configured region, the same data center the calls go to (and the
 * one whose sign-in issued the token).
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
		// Bounds the lookup and the body read; connecting must not hang on it.
		const signal = AbortSignal.timeout(10_000);
		const response = await fetch(
			`${zohoInvoiceApiBase(region)}/organizations`,
			{
				headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
				signal,
			},
		);
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
