import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import {
	asRecord,
	firstString,
	readBodyRecord,
} from 'corsair/core';

// Slack Events API: team_id is on the outer envelope for event_callback payloads.
// See https://api.slack.com/apis/connections/events-api#the-events-api__receiving-events
export function matchSlackTenantWebhook(
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
