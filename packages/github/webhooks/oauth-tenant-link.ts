import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export function resolveGithubOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch | null {
	const installationId = toExternalId(
		asRecord(tokens.installation)?.id ?? tokens.installation_id,
	);
	return installationId
		? { linkType: 'installation_id', externalId: installationId }
		: null;
}
