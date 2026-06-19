import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';

function readTwilioBody(request: RawWebhookRequest) {
	const { body } = request;
	if (typeof body === 'string') {
		try {
			return asRecord(JSON.parse(body));
		} catch {
			const params = new URLSearchParams(body);
			const record: Record<string, unknown> = {};
			for (const [key, value] of params) {
				record[key] = value;
			}
			return Object.keys(record).length > 0 ? record : null;
		}
	}
	return asRecord(body);
}

// Twilio status callbacks and incoming webhooks include AccountSid in the POST body.
// See https://www.twilio.com/docs/usage/webhooks/webhooks-overview
export function matchTwilioTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readTwilioBody(request);
	if (!body) return null;

	const accountSid = firstString([body.AccountSid]);
	if (!accountSid) return null;

	return { linkType: 'accountSid', externalId: accountSid };
}
