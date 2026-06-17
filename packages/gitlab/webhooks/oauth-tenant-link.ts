import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveGitlabOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch('https://gitlab.com/api/v4/user', {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) return null;

	const payload = (await response.json()) as { id?: number | string };
	const userId = toExternalId(payload.id);
	return userId ? { linkType: 'user_id', externalId: userId } : null;
}
