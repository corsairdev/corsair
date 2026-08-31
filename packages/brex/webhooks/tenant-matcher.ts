import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';
import { webhookBodyRecord } from './types';

/** Official webhook payloads include company_id. https://developer.brex.com/guides/webhooks */
export function matchBrexTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = webhookBodyRecord(request.body);
	if (!body) return null;
	const data = asRecord(body.data);
	const companyId = firstString([body.company_id, data?.company_id]);
	if (!companyId) return null;
	return { linkType: 'company_id', externalId: companyId };
}
