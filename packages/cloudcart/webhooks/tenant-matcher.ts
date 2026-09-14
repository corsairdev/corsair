import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchCloudcartTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const headers = (request.headers ?? {}) as Record<string, unknown>;
	const query = (request.query ?? {}) as Record<string, unknown>;

	const storeUrl = firstString([
		body.store_url,
		asRecord(body.data)?.store_url,
		headers['x-cloudcart-store-url'],
		query.store_url,
	]);
	if (storeUrl) {
		return { linkType: 'store_url', externalId: storeUrl };
	}

	const storeId = firstString([
		body.store_id,
		asRecord(body.data)?.store_id,
		headers['x-cloudcart-store-id'],
		query.store_id,
	]);
	if (storeId) {
		return { linkType: 'store_id', externalId: storeId };
	}

	return null;
}
