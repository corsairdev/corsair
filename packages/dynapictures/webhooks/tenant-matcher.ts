import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

/** DynaPictures does not register a tenant webhook matcher for this plugin. */
export function matchDynapicturesTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | undefined {
	return undefined;
}
