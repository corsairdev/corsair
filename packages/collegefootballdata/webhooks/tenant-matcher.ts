import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

/**
 * The College Football Data API has no webhook capability at all -
 * confirmed from the provider's official OpenAPI document, which declares
 * no webhook path or tag among its 74 operations, and the OSS catalog for
 * this integration lists 0 triggers. No webhook handler is ever registered,
 * so this is never reached; it exists only to satisfy the plugin shape.
 */
export function matchCollegeFootballDataTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
