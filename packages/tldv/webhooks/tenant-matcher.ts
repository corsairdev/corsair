import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString } from 'corsair/core';

/**
 * A tl;dv delivery names the meeting and the organizer, but no workspace or
 * organization id, so there is nothing stable to route a tenant by. The
 * organizer's email is the most specific identifier available and is stable per
 * person, so it is used when present and the matcher returns `null` when it is
 * not. Pass `tenantId` on the webhook URL for deterministic routing.
 */
export function matchTldvTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = bodyRecord(request.body);
	if (!body) return null;
	const data = bodyRecord(body.data);
	if (!data) return null;
	const organizer = bodyRecord(data.organizer);
	const externalId = firstString([organizer?.email]);
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
