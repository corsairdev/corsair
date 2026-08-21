import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Routes an inbound Toggl webhook to a tenant.
 *
 * Toggl scopes webhook subscriptions to a workspace and includes the workspace
 * id in the event metadata, so that is the stable external id to route on. It
 * lines up with `togglAuthConfig.api_key.account`.
 *
 * No webhook handlers are registered yet, so in practice this is not reached;
 * it is kept correct so enabling subscriptions later does not require rework.
 */
export function matchTogglTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const metadata = asRecord(body.metadata);
	const externalId = firstString([
		metadata?.workspace_id,
		body.workspace_id,
		asRecord(body.payload)?.workspace_id,
	]);

	// Subscription validation pings carry no workspace id.
	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
