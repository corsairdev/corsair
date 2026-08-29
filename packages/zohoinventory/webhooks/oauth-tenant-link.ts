import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';
import { zohoInventoryApiBase } from '../client';
import type { ZohoOrganization, ZohoOrganizationsListResponse } from '../types';

/**
 * Called after OAuth exchange to discover and store the Zoho Inventory organization_id
 * on the corsair account configuration as tenant_external_id.
 */
export async function resolveZohoInventoryOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// 1. Direct tenant identifier in token response if provided
	const directId = toExternalId(
		tokens.tenant_external_id ?? tokens.organization_id,
	);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	// 2. Fetch organizations from Zoho Inventory API using the authenticated token
	try {
		const apiDomain =
			typeof tokens.api_domain === 'string' ? tokens.api_domain : undefined;
		const base = zohoInventoryApiBase(undefined, apiDomain);
		const response = await fetch(`${base}/organizations`, {
			method: 'GET',
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) return null;

		const payload = (await response.json()) as ZohoOrganizationsListResponse;
		const organizations: ZohoOrganization[] = payload.organizations ?? [];

		if (organizations.length === 0) return null;

		// Select default organization, or fall back to the first available organization
		const selectedOrg =
			organizations.find((org) => org.is_default_org) ?? organizations[0];

		const organizationId = toExternalId(selectedOrg?.organization_id);
		return organizationId
			? { linkType: 'tenant_external_id', externalId: organizationId }
			: null;
	} catch {
		return null;
	}
}
