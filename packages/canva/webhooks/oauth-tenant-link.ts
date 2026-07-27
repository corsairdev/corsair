import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveCanvaOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.user_id);
	if (externalId) {
		return { linkType: 'user_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch('https://api.canva.com/rest/v1/users/me', {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) return null;

	const payload = (await response.json()) as {
		team_user?: { user_id?: string };
	};
	const fetchedId = toExternalId(payload.team_user?.user_id);
	return fetchedId ? { linkType: 'user_id', externalId: fetchedId } : null;
}
