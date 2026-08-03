import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCanvasTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const metadata = asRecord(body.metadata);
	const data = asRecord(body.data);

	const externalId = firstString([
		body.root_account_id,
		body.account_id,
		metadata?.root_account_id,
		metadata?.root_account_uuid,
		data?.account_id,
		data?.root_account_id,
	]);

	if (!externalId) return null;

	return { linkType: 'canvas_account_id', externalId };
}
