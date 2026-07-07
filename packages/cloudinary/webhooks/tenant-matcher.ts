import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCloudinaryTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.cloud_name,
		asRecord(body)?.cloud_name,
		body.signature_key,
	]);

	if (!externalId) return null;

	return { linkType: 'cloud_name', externalId };
}
