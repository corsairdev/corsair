import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, getHeader, readBodyRecord } from 'corsair/core';

// Zoho Mail outgoing webhooks include zuid (Zoho User ID) in the payload.
// Handshake requests only carry x-hook-secret and cannot be tenant-mapped.
// See https://www.zoho.com/mail/help/dev-platform/webhook.html
export function matchZohoMailTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const headers = request.headers ?? {};
	if (getHeader(headers, 'x-hook-secret') !== undefined) return null;

	const body = readBodyRecord(request);
	if (!body) return null;

	const zuid = firstString([body.zuid]);
	if (!zuid) return null;

	return { linkType: 'zuid', externalId: zuid };
}
