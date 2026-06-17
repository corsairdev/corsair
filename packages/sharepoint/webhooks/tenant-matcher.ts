import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function isSharepointValidationHandshake(
	request: RawWebhookRequest,
): boolean {
	const url = (request as unknown as { url?: string }).url ?? '';
	if (url.toLowerCase().includes('validationtoken')) return true;

	const body = readBodyRecord(request);
	return (
		!!body &&
		typeof body.validationToken === 'string' &&
		body.validationToken.length > 0
	);
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

// SharePoint list webhooks use the Microsoft Graph-style value[] notification envelope.
// See https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks
export function matchSharepointTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	if (isSharepointValidationHandshake(request)) return null;

	const body = readBodyRecord(request);
	if (!body || !Array.isArray(body.value)) return null;

	return extractGraphNotificationTenant(body.value);
}
