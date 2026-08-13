import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// 2Chat routes incoming webhook events to a tenant by matching the receiving
// WhatsApp number (to_number) against the phone_number stored during setup.
export function matchTwoChatTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const toNumber = firstString([
		typeof body.to_number === 'string' ? body.to_number : undefined,
		typeof asRecord(body.data)?.to_number === 'string'
			? (asRecord(body.data)?.to_number as string)
			: undefined,
	]);

	if (!toNumber) return null;

	return { linkType: 'phone_number', externalId: toNumber };
}
