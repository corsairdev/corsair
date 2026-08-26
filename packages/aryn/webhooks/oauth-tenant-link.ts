import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

// TODO: Rename linkType 'tenant_external_id' to match pluginTenantWebhookMatcher.
// Called after OAuth to store the routing id on corsair_accounts.config.
export async function resolveArynOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// TODO: Read from token response when the provider includes a stable id.
	// const externalId = toExternalId(asRecord(tokens.team)?.id);
	const externalId = toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	// TODO: Fetch from provider API when the token response omits the id.
	// const response = await fetch('https://api.example.com/me', {
	// 	headers: { Authorization: `Bearer ${accessToken}` },
	// });
	// if (!response.ok) return null;
	// const payload = (await response.json()) as { id?: string };
	// const fetchedId = toExternalId(payload.id);
	// return fetchedId
	// 	? { linkType: 'tenant_external_id', externalId: fetchedId }
	// 	: null;

	return null;
}
