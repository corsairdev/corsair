import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Routes an incoming webhook to the workspace that produced it.
 *
 * Slack puts `team_id` on the outer `event_callback` envelope. For
 * Enterprise Grid the per-event `team` and the `authorizations` array are
 * checked as fallbacks, since org-level installs can omit the envelope id.
 *
 * `url_verification` deliberately returns null: the handshake predates any
 * workspace link, so there is nothing to route to yet.
 */
export function matchSlackbotTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (body.type === 'url_verification') return null;

	const teamId = firstString([
		body.team_id,
		asRecord(body.event)?.team,
		Array.isArray(body.authorizations)
			? asRecord(body.authorizations[0])?.team_id
			: undefined,
	]);

	if (!teamId) return null;

	return { linkType: 'team_id', externalId: teamId };
}
