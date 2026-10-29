import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';
import { zohoInventoryApiBase } from './client';
import type { ZohoOrganization, ZohoOrganizationsListResponse } from './types';

/** After OAuth, store organization_id as tenant_external_id. */
export async function resolveZohoInventoryOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const directId = toExternalId(
		tokens.tenant_external_id ?? tokens.organization_id,
	);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const rawDomain =
			typeof tokens.api_domain === 'string' ? tokens.api_domain : undefined;
		const base = zohoInventoryApiBase(undefined, rawDomain);
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
