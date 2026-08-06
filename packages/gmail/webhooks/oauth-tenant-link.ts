import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveGmailOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch(
		'https://gmail.googleapis.com/gmail/v1/users/me/profile',
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);
	if (!response.ok) return null;

	const payload = (await response.json()) as { emailAddress?: string };
	const emailAddress = toExternalId(payload.emailAddress);
	return emailAddress
		? { linkType: 'email_address', externalId: emailAddress }
		: null;
}
