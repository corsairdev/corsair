import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Every delivery carries X-TwittrAPI-Webhook, the ID of the webhook it was
// sent to. That ID belongs to one TwittrAPI account, so it routes events for
// every watched X account. monitoredUserId names the watched account, which
// a tenant can have up to 5,000 of, so it cannot identify the tenant.
export function matchTwittrApiTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const raw =
		request.headers['x-twittrapi-webhook'] ??
		request.headers['X-TwittrAPI-Webhook'];
	const value = Array.isArray(raw) ? raw[0] : raw;
	const webhookId = typeof value === 'string' ? value.trim() : '';
	if (!webhookId) return null;
	return { linkType: 'webhook_id', externalId: webhookId };
}
