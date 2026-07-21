import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

// Called after OAuth to store the routing id on corsair_accounts.config.
// Atlassian OAuth token responses don't include a stable cloud id directly,
// so we call the accessible-resources endpoint to get the cloudId, which is
// the stable tenant identifier Atlassian uses for webhook routing.
// Ref: https://developer.atlassian.com/cloud/confluence/rest/v2/intro/#accessing
export async function resolveConfluenceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// If the token response already carries a cloud id, use it directly.
	const directId = toExternalId(tokens.tenant_external_id ?? tokens.cloud_id);
	if (directId) {
		return { linkType: 'webhook_identifier', externalId: directId };
	}

	// Otherwise fetch the cloudId from Atlassian's accessible-resources endpoint.
	const accessToken = tokens.access_token;
	if (!accessToken) return null;

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

		const resources = (await response.json()) as Array<{
			id: string;
			cloudId?: string;
		}>;
		const cloudId = resources[0]?.cloudId ?? resources[0]?.id;
		const externalId = toExternalId(cloudId);
		if (!externalId) return null;

		return { linkType: 'webhook_identifier', externalId };
	} catch {
		return null;
	}
}
