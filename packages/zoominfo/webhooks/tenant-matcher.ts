import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * ZoomInfo deliveries identify themselves by the webhook's own id, which the
 * Monitoring API assigns at creation time and repeats in every payload. It is
 * the only stable per-tenant value in the request, so it is what accounts are
 * linked on.
 */
export function matchZoominfoTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([asRecord(body.webhookDetails)?.id]);
	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
