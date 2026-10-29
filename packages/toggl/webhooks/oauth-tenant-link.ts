import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

/**
 * Toggl authenticates with a per-user API token and exposes no OAuth flow, so
 * there is no token response to derive a routing id from. Tenant linking is
 * handled entirely by `matchTogglTenantWebhook` instead.
 */
export async function resolveTogglOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	return null;
}
