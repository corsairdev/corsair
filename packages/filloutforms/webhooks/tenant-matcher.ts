import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchFilloutFormsTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const formId = firstString([body.formId, asRecord(body.submission)?.formId]);

	if (!formId) return null;

	return { linkType: 'form_id', externalId: formId };
}
