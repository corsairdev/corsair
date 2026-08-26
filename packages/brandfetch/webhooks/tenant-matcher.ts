import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

/**
 * Extracts the organization id from a Brandfetch webhook URN.
 * Format: urn:brandfetch:organization:{organizationId}:webhook:{webhookId}:event:{eventId}
 */
export function extractOrganizationIdFromUrn(urn: string): string | undefined {
	const parts = urn.split(':');
	const index = parts.indexOf('organization');
	if (index === -1 || index + 1 >= parts.length) return undefined;
	return parts[index + 1] || undefined;
}

/**
 * Matches the webhook tenant by extracting the stable tenant identifier from the payload.
 * Looks for tenant_external_id first, then falls back to parsing the organization
 * from the webhook URN (e.g. urn:brandfetch:organization:0123:webhook:1234:event:2345),
 * since Brandfetch places the changed resource ID at data.object.id, not data.id.
 * The organization identifier is what must match the OAuth token's tenant_external_id.
 */
export function matchBrandfetchTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const urn = (body as { urn?: unknown }).urn;

	const externalId = firstString([
		body.tenant_external_id,
		typeof urn === 'string' ? extractOrganizationIdFromUrn(urn) : undefined,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
