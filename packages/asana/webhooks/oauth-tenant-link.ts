import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveAsanaOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch(
		'https://app.asana.com/api/1.0/users/me?opt_fields=workspaces.gid',
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);
	if (!response.ok) return null;

	const payload = (await response.json()) as {
		data?: { workspaces?: Array<{ gid?: string }> };
	};
	const workspaceGid = toExternalId(payload.data?.workspaces?.[0]?.gid);
	return workspaceGid
		? { linkType: 'workspace_gid', externalId: workspaceGid }
		: null;
}
