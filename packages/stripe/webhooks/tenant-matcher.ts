import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Stripe Connect events include a top-level `account` field with the connected
// account id (acct_...). Platform-only events omit it.
// See https://docs.stripe.com/connect/webhooks
export function matchStripeTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const accountId = firstString([body.account]);
	if (!accountId) return null;

	return { linkType: 'account_id', externalId: accountId };
}
