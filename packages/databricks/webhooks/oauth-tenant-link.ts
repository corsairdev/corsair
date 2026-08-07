import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveDatabricksOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(
		tokens.workspace_id || tokens.account_id || tokens.tenant_external_id,
	);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	return null;
}
