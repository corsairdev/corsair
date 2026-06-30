import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Vapi Server URL events wrap payloads in message; call.orgId identifies the org.
// See https://docs.vapi.ai/server-url/events
export function matchVapiTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const message = asRecord(body.message);
	const call = asRecord(message?.call);

	const orgId = firstString([call?.orgId, call?.org_id]);
	if (!orgId) return null;

	return { linkType: 'org_id', externalId: orgId };
}
