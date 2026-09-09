import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString } from 'corsair/core';
import { parseWaboxappWebhookBody } from './types';

export function matchWaboxappTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = parseWaboxappWebhookBody(request.body);
	if (!body) return null;

	const externalId = firstString([body.uid]);
	if (!externalId) return null;

	return { linkType: 'uid', externalId };
}
