import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ── Microsoft Graph change notification payload ───────────────────────────────

export const OutlookChangeNotificationSchema = z.object({
	subscriptionId: z.string().optional(),
	subscriptionExpirationDateTime: z.string().optional(),
	changeType: z.enum(['created', 'updated', 'deleted']).optional(),
	// resource is a path string like "Users/me/Messages/AAMkA..."
	resource: z.string().optional(),
	resourceData: z
		.object({
			'@odata.type': z.string().optional(),
			'@odata.id': z.string().optional(),
			'@odata.etag': z.string().optional(),
			id: z.string().optional(),
		})
		.loose()
		.optional(),
	clientState: z.string().optional(),
	tenantId: z.string().optional(),
	eventType: z.string().optional(),
});

export type OutlookChangeNotification = z.infer<
	typeof OutlookChangeNotificationSchema
>;

export const OutlookWebhookPayloadSchema = z.object({
	value: z.array(OutlookChangeNotificationSchema),
});

export type OutlookWebhookPayload = z.infer<typeof OutlookWebhookPayloadSchema>;

// ── Webhook event types ───────────────────────────────────────────────────────

export const MessageReceivedEventSchema =
	OutlookChangeNotificationSchema.extend({
		changeType: z.literal('created'),
	});
export type MessageReceivedEvent = z.infer<typeof MessageReceivedEventSchema>;

export const MessageSentEventSchema = OutlookChangeNotificationSchema.extend({
	changeType: z.literal('created'),
});
export type MessageSentEvent = z.infer<typeof MessageSentEventSchema>;

export const EventCreatedEventSchema = OutlookChangeNotificationSchema.extend({
	changeType: z.literal('created'),
});
export type EventCreatedEvent = z.infer<typeof EventCreatedEventSchema>;

export const EventChangedEventSchema = OutlookChangeNotificationSchema.extend({
	changeType: z.enum(['created', 'updated', 'deleted']),
});
export type EventChangedEvent = z.infer<typeof EventChangedEventSchema>;

export const ContactCreatedEventSchema = OutlookChangeNotificationSchema.extend(
	{
		changeType: z.literal('created'),
	},
);
export type ContactCreatedEvent = z.infer<typeof ContactCreatedEventSchema>;

// ── Subscription validation (Microsoft Graph handshake) ───────────────────────

export const SubscriptionValidationPayloadSchema = z.object({
	validationToken: z.string(),
});
export type SubscriptionValidationPayload = z.infer<
	typeof SubscriptionValidationPayloadSchema
>;

// ── Webhook output map ────────────────────────────────────────────────────────

export type OutlookWebhookOutputs = {
	messageReceived: MessageReceivedEvent;
	messageSent: MessageSentEvent;
	eventCreated: EventCreatedEvent;
	eventChanged: EventChangedEvent;
	contactCreated: ContactCreatedEvent;
	subscriptionValidation: SubscriptionValidationPayload;
};

// ── Match helpers ─────────────────────────────────────────────────────────────

export function createOutlookMatch(
	resourcePattern: RegExp,
	changeTypes: string[] = ['created', 'updated', 'deleted'],
	options?: { excludeResourcePatterns?: RegExp[] },
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		let body: unknown;
		try {
			body =
				typeof request.body === 'string'
					? (JSON.parse(request.body) as unknown)
					: request.body;
		} catch {
			return false;
		}
		if (!body || typeof body !== 'object') return false;
		const value = (body as Record<string, unknown>)['value'];
		if (!Array.isArray(value)) return false;
		return value.some((entry: unknown) => {
			if (!entry || typeof entry !== 'object') return false;
			const notification = entry as Record<string, unknown>;
			const resource =
				typeof notification['resource'] === 'string'
					? notification['resource']
					: undefined;
			if (resource === undefined) return false;
			return (
				resourcePattern.test(resource) &&
				!(
					options?.excludeResourcePatterns?.some((pattern) =>
						pattern.test(resource),
					) ?? false
				) &&
				(notification['changeType'] === undefined ||
					(typeof notification['changeType'] === 'string' &&
						changeTypes.includes(notification['changeType'])))
			);
		});
	};
}

// ── Signature verification ────────────────────────────────────────────────────

export function verifyOutlookWebhookSignature(
	request: WebhookRequest<OutlookWebhookPayload>,
	clientState: string,
): { valid: boolean; error?: string } {
	if (!clientState) {
		return { valid: false, error: 'Missing client state' };
	}

	const notifications = request.payload?.value;
	if (!Array.isArray(notifications) || notifications.length === 0) {
		return { valid: false, error: 'Invalid payload: missing value array' };
	}

	const expected = Buffer.from(clientState);
	const allMatch = notifications.every((n) => {
		if (!n || typeof n !== 'object') return false;
		const client = (n as OutlookChangeNotification).clientState;
		if (typeof client !== 'string') return false;
		const actual = Buffer.from(client);
		return (
			actual.length === expected.length &&
			crypto.timingSafeEqual(actual, expected)
		);
	});

	if (!allMatch) {
		return { valid: false, error: 'Client state mismatch' };
	}

	return { valid: true };
}
