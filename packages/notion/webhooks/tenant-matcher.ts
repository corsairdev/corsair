import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Notion webhook payloads include workspace_id on every event notification.
// Verification handshakes only carry verification_token and should not resolve a tenant.
// See https://developers.notion.com/reference/webhooks
export function matchNotionTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (typeof body.verification_token === 'string') return null;

	const workspaceId = firstString([body.workspace_id]);
	if (!workspaceId) return null;

	return { linkType: 'workspace_id', externalId: workspaceId };
}
