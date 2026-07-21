import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

// Called after OAuth to store the routing id on corsair_accounts.config.
// Atlassian OAuth token responses include `tenant_external_id` (the cloud
// instance id) when available; we fall back to null otherwise, which means
// webhook routing will rely on the cloud URL stored on the account instead.
export async function resolveConfluenceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	return null;
}
