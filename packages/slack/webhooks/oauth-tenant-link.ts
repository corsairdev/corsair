import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export function resolveSlackOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch | null {
	const teamId = toExternalId(asRecord(tokens.team)?.id);
	return teamId ? { linkType: 'team_id', externalId: teamId } : null;
}
