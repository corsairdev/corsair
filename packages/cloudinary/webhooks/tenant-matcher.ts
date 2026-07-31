import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCloudinaryTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	// Cloudinary notification payloads may include cloud_name; signature_key is
	// not a tenant identifier and must not be used for multi-tenant routing.
	const externalId = firstString([body.cloud_name, asRecord(body)?.cloud_name]);

	if (!externalId) return null;

	return { linkType: 'cloud_name', externalId };
}
