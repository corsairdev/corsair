import { z } from 'zod';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';

// ─────────────────────────────────────────────────────────────────────────────
// SharePoint webhook notification payload
// SharePoint sends a thin notification envelope; actual changes must be fetched
// via the GetChanges API using the provided resource identifier.
// ─────────────────────────────────────────────────────────────────────────────

export const SharepointWebhookNotificationSchema = z.object({
	subscriptionId: z.string(),
	clientState: z.string().nullable().optional(),
	expirationDateTime: z.string().optional(),
	resource: z.string(),
	tenantId: z.string(),
	siteUrl: z.string(),
	webId: z.string(),
});
export type SharepointWebhookNotification = z.infer<typeof SharepointWebhookNotificationSchema>;

export const SharepointListChangedPayloadSchema = z.object({
	value: z.array(SharepointWebhookNotificationSchema),
});
export type SharepointListChangedPayload = z.infer<typeof SharepointListChangedPayloadSchema>;

export const ListChangedEventSchema = z.object({
	subscriptionId: z.string(),
	resource: z.string(),
	siteUrl: z.string(),
	webId: z.string(),
	tenantId: z.string(),
	receivedAt: z.date(),
});
export type ListChangedEvent = z.infer<typeof ListChangedEventSchema>;

export type SharepointWebhookOutputs = {
	listChanged: ListChangedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		// Body may be a JSON string that needs to be parsed
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

/**
 * Matches incoming SharePoint webhook notifications.
 * SharePoint posts a JSON body with a "value" array of notification objects.
 * SharePoint also sends a validationtoken query param during subscription setup.
 */
export function createSharepointMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// Subscription validation handshake — SharePoint sends a GET/POST with validationtoken
		// RawWebhookRequest does not include url; the framework may extend it at runtime
		const url = (request as unknown as { url?: string }).url ?? '';
		if (url.includes('validationtoken')) {
			return true;
		}

		const parsedBody = parseBody(request.body);
		// SharePoint list change notifications always have a "value" array
		if (!Array.isArray(parsedBody.value)) {
			return false;
		}

		if (eventType === 'listChanged') {
			// All SharePoint list webhook notifications match this type
			const first = (parsedBody.value as Record<string, unknown>[])[0];
			return first != null && typeof first.subscriptionId === 'string';
		}

		return false;
	};
}

/**
 * Verifies that the incoming request is a legitimate SharePoint webhook notification.
 * SharePoint does not sign webhook payloads with HMAC — validation relies on
 * a client-state secret set during subscription creation.
 */
export function verifySharepointWebhookSignature(
	request: WebhookRequest<SharepointListChangedPayload>,
	clientState?: string,
): { valid: boolean; error?: string } {
	if (!clientState) {
		// No secret configured; skip verification
		return { valid: true };
	}

	const notifications = request.payload?.value;
	if (!Array.isArray(notifications) || notifications.length === 0) {
		return { valid: false, error: 'Invalid payload: missing value array' };
	}

	const first = notifications[0];
	if (first?.clientState !== clientState) {
		return { valid: false, error: 'Client state mismatch' };
	}

	return { valid: true };
}
