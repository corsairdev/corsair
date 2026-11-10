import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

/**
 * Eventbrite's token response carries no organization id: an OAuth token is
 * issued for a user, and a user can belong to several organizations, so there
 * is no single id to link a webhook tenant on. Returning null is the documented
 * answer for a provider with no stable id in the token exchange; the account is
 * linked on `organization_id` directly instead.
 *
 * This plugin authenticates with a private token (`api_key`), so this resolver
 * is only reached if the token exchange is wired up elsewhere.
 */
export async function resolveEventbriteOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const record = asRecord(tokens);
	// Some exchanges copy an organization id through; use it when present.
	const externalId = toExternalId(record?.organization_id);
	return externalId ? { linkType: 'organization_id', externalId } : null;
}
