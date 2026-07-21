import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

// Called after OAuth to store the routing id on corsair_accounts.config.
// Atlassian OAuth token responses don't include a stable cloud id directly,
// but the token response includes the `access_token` which we can use to
// call the accessible-resources endpoint to get the cloudId. For the scaffold
// we derive the link from the token fields we have; a follow-up can add the
// API call for deployments that need provider-controlled tenant resolution.
export async function resolveConfluenceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.tenant_external_id ?? tokens.cloud_id);
	if (externalId) {
		return { linkType: 'webhook_identifier', externalId };
	}

	return null;
}
