import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveDropboxOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const accountId = toExternalId(tokens.uid ?? tokens.account_id);
	if (accountId) {
		return { linkType: 'account_id', externalId: accountId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch(
		'https://api.dropboxapi.com/2/users/get_current_account',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: 'null',
		},
	);
	if (!response.ok) return null;

	const payload = (await response.json()) as { account_id?: string };
	const fetchedAccountId = toExternalId(payload.account_id);
	return fetchedAccountId
		? { linkType: 'account_id', externalId: fetchedAccountId }
		: null;
}
