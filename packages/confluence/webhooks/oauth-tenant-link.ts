import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

type AccessibleResource = {
	id: string;
	cloudId?: string;
	url?: string;
};

// Called after OAuth to store the routing id on corsair_accounts.config.
// Atlassian OAuth token responses don't include a stable cloud id directly,
// so we call the accessible-resources endpoint to get the cloudId, which is
// the stable tenant identifier Atlassian uses for webhook routing.
// If multiple sites are accessible, we match against the cloud URL stored
// during OAuth to select the correct one.
// Ref: https://developer.atlassian.com/cloud/confluence/rest/v2/intro/#accessing
export async function resolveConfluenceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// If the token response already carries a cloud id, use it directly.
	const directId = toExternalId(tokens.tenant_external_id ?? tokens.cloud_id);
	if (directId) {
		return { linkType: 'webhook_identifier', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const cloudUrl =
		typeof tokens.cloud_url === 'string' ? tokens.cloud_url : null;

	let resources: AccessibleResource[];
	try {
		const response = await fetch(
			'https://api.atlassian.com/oauth/token/accessible-resources',
			{
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		if (!response.ok) return null;
		resources = (await response.json()) as AccessibleResource[];
	} catch {
		return null;
	}

	if (!resources.length) return null;

	// If we have a cloud URL, match the specific site. Otherwise this is
	// ambiguous - return null so the caller knows no link was established.
	const matched = cloudUrl
		? resources.find((r) => r.url && cloudUrl.includes(r.url))
		: null;

	const selected = matched ?? (resources.length === 1 ? resources[0] : null);
	if (!selected) return null;

	const cloudId = selected.cloudId ?? selected.id;
	const externalId = toExternalId(cloudId);
	if (!externalId) return null;

	return { linkType: 'webhook_identifier', externalId };
}
