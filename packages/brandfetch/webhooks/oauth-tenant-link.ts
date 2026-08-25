import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

/**
 * Resolves the webhook tenant link from OAuth token response.
 * The tenant_external_id field uniquely identifies the account/team in Brandfetch.
 */
export async function resolveBrandfetchOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	return null;
}
