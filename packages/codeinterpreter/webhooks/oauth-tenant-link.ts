import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveCodeInterpreterOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const sessionId = toExternalId(tokens.session_id);
	if (sessionId) {
		return { linkType: 'session_id', externalId: sessionId };
	}

	const tenantExternalId = toExternalId(tokens.tenant_external_id);
	if (tenantExternalId) {
		return { linkType: 'tenant_external_id', externalId: tenantExternalId };
	}

	return null;
}
