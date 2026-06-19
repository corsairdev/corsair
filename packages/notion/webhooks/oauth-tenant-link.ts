import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export async function resolveNotionOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const workspaceId = toExternalId(tokens.workspace_id);
	if (workspaceId) {
		return { linkType: 'workspace_id', externalId: workspaceId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch('https://api.notion.com/v1/users/me', {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) return null;

	const payload = (await response.json()) as Record<string, unknown>;
	const fetchedWorkspaceId = toExternalId(
		asRecord(payload.bot)?.workspace_id ?? payload.workspace_id,
	);
	return fetchedWorkspaceId
		? { linkType: 'workspace_id', externalId: fetchedWorkspaceId }
		: null;
}
