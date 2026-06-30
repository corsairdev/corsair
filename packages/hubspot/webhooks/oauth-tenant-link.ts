import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export async function resolveHubspotOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const portalId = toExternalId(
		tokens.hub_id ?? asRecord(tokens.hub_domain)?.hub_id,
	);
	if (portalId) {
		return { linkType: 'portal_id', externalId: portalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch(
		`https://api.hubapi.com/oauth/v1/access-tokens/${encodeURIComponent(accessToken)}`,
	);
	if (!response.ok) return null;

	const payload = (await response.json()) as { hub_id?: number | string };
	const fetchedPortalId = toExternalId(payload.hub_id);
	return fetchedPortalId
		? { linkType: 'portal_id', externalId: fetchedPortalId }
		: null;
}
