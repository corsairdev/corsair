// Shared by the OAuth tenant-link resolver and the webhook tenant matcher so the
// user-scoped key is formatted in exactly one place. The format must stay in sync
// with Hub's slack-routing.ts — a BYO+Hub app forwards this link for Hub to match.
export const SLACK_USER_LINK_TYPE = 'slack_user';

export function slackUserExternalId(teamId: string, userId: string): string {
	return `${teamId}:${userId}`;
}
