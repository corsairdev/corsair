import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Intercom notification payloads include app_id, which identifies the workspace.
// See https://developers.intercom.com/docs/references/webhooks/webhook-models
export function matchIntercomTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const appId = firstString([body.app_id]);
	if (!appId) return null;

	return { linkType: 'app_id', externalId: appId };
}
