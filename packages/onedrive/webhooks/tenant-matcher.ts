import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';
import { extractOnedriveValidationToken } from './types';

function extractGraphNotificationTenant(
	notifications: unknown[],
): WebhookTenantMatch | null {
	for (const item of notifications) {
		const notification = asRecord(item);
		if (!notification) continue;

		const subscriptionId = firstString([notification.subscriptionId]);
		if (subscriptionId) {
			return { linkType: 'subscription_id', externalId: subscriptionId };
		}

		const clientState = firstString([notification.clientState]);
		if (clientState) {
			return { linkType: 'client_state', externalId: clientState };
		}
	}

	return null;
}

// Microsoft Graph change notifications: subscriptionId and clientState in body.value[].
// See https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks
export function matchOnedriveTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	if (extractOnedriveValidationToken(request)) return null;

	const body = readBodyRecord(request);
	if (!body || !Array.isArray(body.value)) return null;

	return extractGraphNotificationTenant(body.value);
}
