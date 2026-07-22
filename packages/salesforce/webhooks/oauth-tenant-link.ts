import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveSalesforceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// 1. Direct external ID or organization_id field in token response
	const directId = toExternalId(
		tokens.organization_id ||
			tokens.tenant_external_id ||
			(tokens.custom_attributes as Record<string, string> | undefined)
				?.organization_id,
	);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	// 2. Extract org ID from Salesforce identity URL (https://login.salesforce.com/id/{orgId}/{userId})
	if (typeof tokens.id === 'string' && tokens.id.includes('/id/')) {
		const parts = tokens.id.split('/id/');
		if (parts[1]) {
			const subParts = parts[1].split('/');
			const orgId = subParts[0];
			if (orgId && orgId.startsWith('00D')) {
				return { linkType: 'tenant_external_id', externalId: orgId };
			}
		}
	}

	// 3. User Identity Endpoint fetch fallback if tokens.id is a URL
	if (typeof tokens.id === 'string' && tokens.access_token) {
		try {
			const res = await fetch(tokens.id, {
				headers: { Authorization: `Bearer ${tokens.access_token}` },
			});
			if (res.ok) {
				const payload = (await res.json()) as {
					organization_id?: string;
					org_id?: string;
				};
				const fetchedId = toExternalId(
					payload.organization_id || payload.org_id,
				);
				if (fetchedId) {
					return { linkType: 'tenant_external_id', externalId: fetchedId };
				}
			}
		} catch {
			// ignore network error
		}
	}

	return null;
}
