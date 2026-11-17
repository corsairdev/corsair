import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

/**
 * A Vercel integration install is made for one team or for a personal account.
 * The team comes only from the token response's `team_id` (null for a personal
 * account), which Vercel issues for this code. The install redirect also
 * carries `teamId`, but redirect params aren't covered by the OAuth state, so
 * a crafted callback could name another team; it is ignored. The team is saved
 * on the connection as `team_id`, so every call targets it, and inbound
 * webhooks for that team route to this tenant.
 */
export async function resolveVercelOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const teamId = toExternalId(tokens.team_id);
	return teamId ? { linkType: 'team_id', externalId: teamId } : null;
}
