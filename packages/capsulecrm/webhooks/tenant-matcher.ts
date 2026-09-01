import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';

export function matchCapsuleCrmTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const query = request.query ?? {};
	const body = asRecord(request.body);
	const subdomain = firstString([
		query.subdomain,
		query.account,
		body?.subdomain,
	]);
	if (!subdomain) return null;
	return { linkType: 'subdomain', externalId: subdomain };
}
