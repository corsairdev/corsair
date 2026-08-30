import type { WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';

/** Official webhook payloads include company_id. https://developer.brex.com/guides/webhooks */
export function matchBrexTenantWebhook(
	body: unknown,
): WebhookTenantMatch | null {
	const record = asRecord(body);
	const data = asRecord(record?.data);
	const companyId = firstString([record?.company_id, data?.company_id]);
	if (!companyId) return null;
	return { linkType: 'company_id', externalId: companyId };
}
