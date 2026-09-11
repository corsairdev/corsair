import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveCodeInterpreterOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.session_id) || toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'session_id', externalId };
	}

	return null;
}
