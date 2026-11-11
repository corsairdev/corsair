import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Shippo's webhook payload carries no account id: it is the track, transaction
 * or batch object, and the subscription is registered per Shippo account. So
 * there is nothing in the body to route a tenant on, and this returns null
 * rather than guessing from an object id.
 *
 * A multi-tenant deployment needs one inbound URL per account, or a
 * `tenantId` query parameter set when the webhook is registered. Returning null
 * makes `processWebhook` fall back to `query.tenantId`.
 */
export function matchShippoTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	// Confirmed absent rather than unimplemented: the delivery is the object
	// itself, and no Shippo object carries its owning account's id.
	const body = readBodyRecord(request);
	if (!body) return null;

	const explicit = firstString([
		asRecord(body.metadata)?.shippo_account_id,
		body.shippo_account_id,
	]);
	if (!explicit) return null;

	return { linkType: 'shippo_account_id', externalId: explicit };
}
