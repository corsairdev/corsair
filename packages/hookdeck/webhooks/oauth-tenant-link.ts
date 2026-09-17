import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export async function resolveHookdeckOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId =
		toExternalId(tokens.tenant_external_id) ??
		toExternalId(tokens.team_id) ??
		toExternalId(asRecord(tokens.team)?.id) ??
		toExternalId(tokens.account_id) ??
		toExternalId(tokens.organization_id);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	return null;
}
