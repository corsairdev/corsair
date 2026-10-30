import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCanvaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([body.user_id, asRecord(body.data)?.user_id]);

	if (!externalId) return null;

	return { linkType: 'user_id', externalId };
}
