import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

/**
 * A Vercel integration install is made for one team or for a personal account.
 * The token response carries `team_id` (null for a personal account) and the
 * install redirect carries `teamId`; Corsair passes both here. The team is
 * saved on the connection as `team_id`, so every call targets it, and inbound
 * webhooks for that team route to this tenant.
 */
export async function resolveVercelOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const teamId = toExternalId(tokens.team_id) ?? toExternalId(tokens.teamId);
	return teamId ? { linkType: 'team_id', externalId: teamId } : null;
}
