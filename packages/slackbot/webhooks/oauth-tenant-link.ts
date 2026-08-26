import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

/**
 * Records which workspace an OAuth install belongs to, so later webhooks can be
 * routed back to it.
 *
 * `oauth.v2.access` returns the workspace as a nested `team: { id, name }`
 * object, which is the same id the Events API sends as `team_id`.
 */
export function resolveSlackbotOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch | null {
	const teamId = toExternalId(asRecord(tokens.team)?.id);
	return teamId ? { linkType: 'team_id', externalId: teamId } : null;
}
