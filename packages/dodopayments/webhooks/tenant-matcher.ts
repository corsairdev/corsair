import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Dodo Payments webhooks include business_id at the top level of the JSON body.
// See https://docs.dodopayments.com/developer-resources/webhooks
export function matchDodoPaymentsTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const businessId = firstString([body.business_id]);
	if (!businessId) return null;

	return { linkType: 'business_id', externalId: businessId };
}
