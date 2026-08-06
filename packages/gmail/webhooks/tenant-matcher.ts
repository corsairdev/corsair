import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import {
	asRecord,
	decodePubSubData,
	firstString,
	readBodyRecord,
} from 'corsair/core';

// Gmail Pub/Sub push: emailAddress is in the base64-decoded message.data JSON.
// See https://developers.google.com/workspace/gmail/api/guides/push
export function matchGmailTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const decoded = asRecord(decodePubSubData(body));
	const emailAddress = firstString([decoded?.emailAddress]);
	if (!emailAddress) return null;

	return { linkType: 'email_address', externalId: emailAddress };
}
