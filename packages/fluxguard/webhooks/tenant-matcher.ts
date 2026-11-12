import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString } from 'corsair/core';

/**
 * Every delivery names the organisation in `orgId`, the same id account.get
 * returns. Store it on the account as tenant_external_id to route deliveries
 * to the right tenant. Deliveries can also carry a site, but a site belongs to
 * one organisation, so the org id is the safer key.
 */
export function matchFluxguardTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = bodyRecord(request.body);
	if (!body) return null;
	const externalId = firstString([body.orgId]);
	return externalId ? { linkType: 'tenant_external_id', externalId } : null;
}

/**
 * The tenant matcher runs before the payload is parsed, and `readBodyRecord`
 * only accepts an already-parsed object, so a raw body is parsed here.
 */
function bodyRecord(
	// unknown: the body arrives as text or as an object parsed by the framework.
	body: unknown,
): Record<string, unknown> | null {
	const parsed =
		typeof body === 'string'
			? (() => {
					try {
						return JSON.parse(body) as unknown;
					} catch {
						return undefined;
					}
				})()
			: body;
	return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
		? (parsed as Record<string, unknown>)
		: null;
}
