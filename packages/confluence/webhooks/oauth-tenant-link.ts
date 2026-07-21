import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

type AccessibleResource = {
	id: string;
	cloudId?: string;
	url?: string;
};

// Called after OAuth to store the routing id on corsair_accounts.config.
// Fetches the Confluence cloudId from Atlassian's accessible-resources
// endpoint. The cloudId is the stable tenant identifier used for webhook
// routing. If multiple sites are accessible, we match against the cloud URL
// from the OAuth flow to select the correct one.
// Ref: https://developer.atlassian.com/cloud/confluence/rest/v2/intro/#accessing
export async function resolveConfluenceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const directId = toExternalId(tokens.tenant_external_id ?? tokens.cloud_id);
	if (directId) {
		return { linkType: 'webhook_identifier', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const cloudUrl =
		typeof tokens.cloud_url === 'string' ? tokens.cloud_url : null;

	const response = await fetch(
		'https://api.atlassian.com/oauth/token/accessible-resources',
		{
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
	if (!response.ok) {
		throw new Error(
			`Failed to resolve Atlassian accessible resources: ${response.status}`,
		);
	}

	const resources = (await response.json()) as AccessibleResource[];
	if (!resources.length) return null;

	// Match the connected site if we have a cloud URL.
	// If only one site is accessible, use it directly.
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
