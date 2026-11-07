import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Webhook endpoints are configured per organization, and the embedded
// Meeting carries the organization id it belongs to. Store that id as
// tenant_external_id to route deliveries to the right tenant.
export function matchHappyScribeTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	const object = body?.data;
	const meeting =
		object && typeof object === 'object' && !Array.isArray(object)
			? (object as Record<string, unknown>).object
			: undefined;
	if (!meeting || typeof meeting !== 'object' || Array.isArray(meeting)) {
		return null;
	}
	const externalId = firstString([
		(meeting as Record<string, unknown>).organization_id,
	]);
	if (!externalId) return null;
	return { linkType: 'tenant_external_id', externalId };
}
