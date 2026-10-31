import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';
import { SLACK_USER_LINK_TYPE, slackUserExternalId } from './user-link';

// Slack Events API: team_id is on the outer envelope for event_callback payloads.
// See https://api.slack.com/apis/connections/events-api#the-events-api__receiving-events
export function matchSlackTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch[] {
	const body = readBodyRecord(request);
	if (!body) return [];

	if (body.type === 'url_verification') return [];

	const auth = Array.isArray(body.authorizations)
		? asRecord(body.authorizations[0])
		: undefined;

	const teamId = firstString([
		body.team_id,
		asRecord(body.event)?.team,
		auth?.team_id,
	]);

	if (!teamId) return [];

	// authorizations[0].user_id is the installation the event is visible to — the
	// only field safe for user-scoped routing (event.user is merely the actor).
	// Ordered most-specific first; absent it, fall back to workspace routing.
	const userId = firstString([auth?.user_id]);
	const matches: WebhookTenantMatch[] = [];
	if (userId) {
		matches.push({
			linkType: SLACK_USER_LINK_TYPE,
			externalId: slackUserExternalId(teamId, userId),
		});
	}
	matches.push({ linkType: 'team_id', externalId: teamId });
	return matches;
}
