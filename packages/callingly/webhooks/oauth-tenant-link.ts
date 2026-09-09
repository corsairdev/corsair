import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveCallinglyOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId =
		toExternalId(tokens.account_id) ?? toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	return null;
}
