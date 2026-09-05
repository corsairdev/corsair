import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';

/**
 * Benzinga webhook deliveries carry `id`, `api_version`, `kind` and `data`
 * (https://docs.benzinga.com/webhook-reference/overview) with no account or
 * tenant identifier, so there is no stable external id to route on. Returning
 * null signals that tenant routing is unavailable for this payload.
 */
export function matchBenzingaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;
	return null;
}
