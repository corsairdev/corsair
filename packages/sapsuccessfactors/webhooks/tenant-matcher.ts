import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// SAP SuccessFactors REST/OData plugin does not expose inbound webhooks in this integration.
export function matchSapsuccessfactorsTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
