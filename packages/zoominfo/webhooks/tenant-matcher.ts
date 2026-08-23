import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * ZoomInfo deliveries identify themselves by the webhook's own id, which the
 * Monitoring API assigns at creation time and repeats in every payload. It is
 * the only stable per-tenant value in the request, so it is what accounts are
 * linked on.
 *
 * ZoomInfo has no OAuth callback to derive that id from, so a multi-tenant
 * deployment sets the account's `tenant_external_id` to the id returned by
 * POST /webhooks when the subscription is created. Single-tenant deployments
 * need nothing: the id simply will not resolve and delivery falls back.
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
