import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * A delivery carries the organization id as `config.user_id` — Eventbrite's
 * name for it, which is why it is read here rather than renamed. The
 * organization id is what `authConfig` links the account on, so a delivery for
 * one organization never resolves to another tenant's token.
 */
export function matchEventbriteTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const config = asRecord(body.config);
	const externalId = firstString([config?.user_id, body.user_id]);
	if (!externalId) return null;

	return { linkType: 'organization_id', externalId };
}
