import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import { SLACK_USER_LINK_TYPE, slackUserExternalId } from './user-link';

export function resolveSlackOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch[] {
	const teamId = toExternalId(asRecord(tokens.team)?.id);
	if (!teamId) return [];
	// team.id is the workspace; authed_user.id the installing user. The user link
	// lets same-workspace tenants route individually.
	const links: WebhookTenantMatch[] = [
		{ linkType: 'team_id', externalId: teamId },
	];
	const userId = toExternalId(asRecord(tokens.authed_user)?.id);
	if (userId) {
		links.push({
			linkType: SLACK_USER_LINK_TYPE,
			externalId: slackUserExternalId(teamId, userId),
		});
	}
	return links;
}
