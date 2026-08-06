import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';

// GitLab webhook payloads identify project_id / group_id, not the OAuth user id.
// Persist the link when registering a project or group webhook via setWebhookTenantLink.
export function resolveGitlabOAuthWebhookTenantLink(
	_tokens: TokenResponse,
): WebhookTenantMatch | null {
	return null;
}
