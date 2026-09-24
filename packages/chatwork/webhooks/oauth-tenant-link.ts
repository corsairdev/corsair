import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveChatworkOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.account_id);
	if (externalId) {
		return { linkType: 'account_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch('https://api.chatwork.com/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as { account_id?: number | string };
		const fetchedId = toExternalId(payload.account_id);
		return fetchedId ? { linkType: 'account_id', externalId: fetchedId } : null;
	} catch {
		return null;
	}
}
