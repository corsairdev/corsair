import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchFaradayTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		asRecord(body.data)?.account_id,
		body.account_id,
	]);
	if (!externalId) return null;

	return { linkType: 'account_id', externalId };
}
