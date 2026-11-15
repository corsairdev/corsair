import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { FAL_WEBHOOK_HEADERS, headerValue } from './types';

/**
 * fal names the account that made the request in `x-fal-webhook-user-id`
 * (for example `github|abc123`). It routes to the Corsair account whose
 * `user_id` holds that value. Without it, pass `tenantId` on the webhook URL.
 */
export function matchFalTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const userId = headerValue(
		request.headers as Record<string, string | string[] | undefined>,
		FAL_WEBHOOK_HEADERS.userId,
	);
	return userId ? { linkType: 'user_id', externalId: userId } : null;
}
