import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveLinearOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch('https://api.linear.app/graphql', {
		method: 'POST',
		headers: {
			Authorization: accessToken,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: 'query { viewer { organization { id } } }',
		}),
	});
	if (!response.ok) return null;

	const payload = (await response.json()) as {
		data?: { viewer?: { organization?: { id?: string } } };
	};
	const organizationId = toExternalId(
		payload.data?.viewer?.organization?.id,
	);
	return organizationId
		? { linkType: 'organization_id', externalId: organizationId }
		: null;
}
