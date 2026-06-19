import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Tally FORM_RESPONSE webhooks include the form id on data.formId.
// See https://tally.so/help/webhooks
export function matchTallyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const data = asRecord(body.data);
	const formId = firstString([data?.formId]);
	if (!formId) return null;

	return { linkType: 'form_id', externalId: formId };
}
