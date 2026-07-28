import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';
import { makeCanvaRequest } from '../client';

export async function resolveCanvaOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.user_id);
	if (externalId) {
		return { linkType: 'user_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const payload = await makeCanvaRequest<{
			team_user?: { user_id?: string };
		}>('v1/users/me', accessToken, { method: 'GET' });
		const fetchedId = toExternalId(payload.team_user?.user_id);
		return fetchedId ? { linkType: 'user_id', externalId: fetchedId } : null;
	} catch {
		return null;
	}
}
