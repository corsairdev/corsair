import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Waboxapp has no signature header, so we match tenants by the `token`
// field in the body — that's the account's API token, unique per connected
// Waboxapp/WhatsApp session.
export function matchWaboxappTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([body.token]);
	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
