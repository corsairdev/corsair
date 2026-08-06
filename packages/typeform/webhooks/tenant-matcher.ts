import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Typeform delivers form_response webhooks with form_id but no account id.
// See https://www.typeform.com/developers/webhooks/example-payload/
export function matchTypeformTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const formResponse = asRecord(body.form_response);
	const formId = firstString([
		formResponse?.form_id,
		asRecord(formResponse?.definition)?.id,
	]);
	if (!formId) return null;

	return { linkType: 'form_id', externalId: formId };
}
