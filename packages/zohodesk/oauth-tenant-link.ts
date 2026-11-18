import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';
import type { ZohoDeskRegion } from './client';
import {
	makeZohoDeskRequest,
	regionFromTokenData,
	soleOrganizationId,
} from './client';

/**
 * After OAuth, stores the Zoho Desk org ID as `tenant_external_id` so that
 * calls can send the `orgId` header. This is the only hook core offers for
 * saving a value from the token exchange. Returns null when the user has
 * several orgs: see `soleOrganizationId`.
 */
export async function resolveZohoDeskOAuthTenantLink(
	tokens: TokenResponse,
	configuredRegion?: ZohoDeskRegion,
): Promise<WebhookTenantMatch | null> {
	const directId = toExternalId(tokens.tenant_external_id ?? tokens.orgId);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const body = await makeZohoDeskRequest(
			accessToken,
			regionFromTokenData(tokens) ?? configuredRegion,
			{ path: '/organizations' },
		);
		const orgId = soleOrganizationId(body);
		return orgId ? { linkType: 'tenant_external_id', externalId: orgId } : null;
	} catch {
		// Connecting must not fail on this: calls look the org up themselves.
		return null;
	}
}
