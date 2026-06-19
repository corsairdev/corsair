import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Razorpay event webhooks include account_id on the outer envelope.
// See https://razorpay.com/docs/webhooks/payments/
export function matchRazorpayTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const accountId = firstString([body.account_id]);
	if (!accountId) return null;

	return { linkType: 'account_id', externalId: accountId };
}
