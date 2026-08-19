import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Extract the Attio workspace ID from an incoming webhook payload.
 * Attio webhook events include the workspace identifier in the body,
 * which lets us route the webhook to the correct tenant account.
 * Returns null for handshake/verification payloads that have no tenant id.
 */
export function matchAttioTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	// Attio webhooks include workspace_id at the top level or nested in data
	const externalId = firstString([
		body.workspace_id,
		asRecord(body.data)?.workspace_id,
		body.tenant_external_id,
		asRecord(body.data)?.tenant_external_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
