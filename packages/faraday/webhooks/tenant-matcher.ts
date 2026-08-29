import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function readFaradayBody(request: RawWebhookRequest) {
	const record = readBodyRecord(request);
	if (record) return record;
	if (typeof request.body !== 'string') return null;
	try {
		return asRecord(JSON.parse(request.body));
	} catch {
		return null;
	}
}

export function matchFaradayTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readFaradayBody(request);
	if (!body) return null;

	const externalId = firstString([
		asRecord(body.data)?.account_id,
		body.account_id,
	]);
	if (!externalId) return null;

	return { linkType: 'account_id', externalId };
}
