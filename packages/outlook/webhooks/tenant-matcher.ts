import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import {
	asRecord,
	firstString,
	getHeader,
	readBodyRecord,
} from 'corsair/core';

function isOutlookValidationHandshake(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	if (
		body &&
		typeof body.validationToken === 'string' &&
		body.validationToken.length > 0
	) {
		return true;
	}

	const contentType = getHeader(request.headers, 'content-type');
	if (contentType?.includes('text/plain')) {
		return !body || Object.keys(body).length === 0;
	}

	return false;
}

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
export function matchOutlookTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	if (isOutlookValidationHandshake(request)) return null;

	const body = readBodyRecord(request);
	if (!body || !Array.isArray(body.value)) return null;

	return extractGraphNotificationTenant(body.value);
}
