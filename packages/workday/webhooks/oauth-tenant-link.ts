import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export async function resolveWorkdayOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.tenant_external_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	return null;
}
