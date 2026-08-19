import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Routes an inbound Botpress webhook to a tenant.
 *
 * No webhook handlers are registered yet — the OSS catalog lists zero
 * triggers for Botpress — so in practice this is not reached. It is kept
 * correct, routing on `workspaceId` to line up with
 * `botpressAuthConfig.api_key.account`, so enabling webhooks later does not
 * require rework.
 */
export function matchBotpressTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.workspaceId,
		body.workspace_id,
		asRecord(body.data)?.workspaceId,
	]);

	if (!externalId) return null;

	return { linkType: 'workspace_id', externalId };
}
