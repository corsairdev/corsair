import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export function resolveSlackbotOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch | null {
	if (tokens.is_enterprise_install === true) {
		const enterpriseId = toExternalId(asRecord(tokens.enterprise)?.id);
		if (enterpriseId) {
			return { linkType: 'enterprise_id', externalId: enterpriseId };
		}
	}

	const teamId = toExternalId(asRecord(tokens.team)?.id);
	return teamId ? { linkType: 'team_id', externalId: teamId } : null;
}
