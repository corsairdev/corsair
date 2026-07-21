import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, getHeader } from 'corsair/core';

// Atlassian Cloud webhooks include the `X-Atlassian-Webhook-Identifier` header,
// a provider-set routing id unique per tenant. We trust this header (set by
// Atlassian) rather than body fields (which could be spoofed by a caller).
// Ref: https://developer.atlassian.com/cloud/jira/platform/webhooks/
export function matchConfluenceTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const externalId = firstString([
		getHeader(request.headers, 'x-atlassian-webhook-identifier'),
	]);

	if (!externalId) return null;

	return { linkType: 'webhook_identifier', externalId };
}
