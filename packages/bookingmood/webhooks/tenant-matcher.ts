import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';
import { parseBody } from './types';

export function matchBookingmoodTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = parseBody(request.body);
	if (!body) return null;

	const change = asRecord(body.payload);
	const externalId = firstString([
		body.organization_id,
		asRecord(change?.new)?.organization_id,
		asRecord(change?.old)?.organization_id,
	]);

	if (!externalId) return null;
	return { linkType: 'organization_id', externalId };
}
