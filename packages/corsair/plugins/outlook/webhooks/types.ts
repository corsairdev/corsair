import { z } from 'zod';
import crypto from 'crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from '../../../core';

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
		.passthrough()
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

export const MessageReceivedEventSchema = OutlookChangeNotificationSchema.extend(
	{
		changeType: z.literal('created'),
	},
);
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

// ── Webhook output map ────────────────────────────────────────────────────────

export type OutlookWebhookOutputs = {
	messageReceived: MessageReceivedEvent;
	messageSent: MessageSentEvent;
	eventCreated: EventCreatedEvent;
	eventChanged: EventChangedEvent;
	contactCreated: ContactCreatedEvent;
};

// ── Match helpers ─────────────────────────────────────────────────────────────

export function createOutlookMatch(
	resourcePattern: RegExp,
	changeTypes: string[] = ['created', 'updated', 'deleted'],
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// body may be a raw string or already parsed — normalize before checking
		const body = typeof request.body === 'string'
			// JSON.parse returns `any`; cast to `unknown` first to force explicit narrowing below
			? (JSON.parse(request.body) as unknown)
			: request.body;
		// Payload shape is validated at runtime by the Zod schema in the webhook handler;
		// the cast here is safe because the match function is only called with Outlook-sourced bodies
		const payload = body as OutlookWebhookPayload;
		return (
			payload?.value?.some(
				(notification) =>
					notification.resource !== undefined &&
					resourcePattern.test(notification.resource) &&
					(notification.changeType === undefined ||
						changeTypes.includes(notification.changeType)),
			) ?? false
		);
	};
}

// ── Signature verification ────────────────────────────────────────────────────

export function verifyOutlookWebhookSignature(
	request: WebhookRequest<OutlookWebhookPayload>,
	clientState: string,
): { valid: boolean; error?: string } {
	if (!clientState) {
		return { valid: true };
	}

	const notifications = request.payload?.value ?? [];
	const allMatch = notifications.every(
		(n) => !n.clientState || n.clientState === clientState,
	);

	if (!allMatch) {
		return { valid: false, error: 'Client state mismatch' };
	}

	return { valid: true };
}

export function verifyOutlookLifecycleSignature(
	validationToken: string,
	secret: string,
): boolean {
	if (!secret) return true;
	// Microsoft Graph sends HMAC SHA256 of the validationToken signed with the client secret
	const expected = crypto
		.createHmac('sha256', secret)
		.update(validationToken)
		.digest('base64');
	return crypto.timingSafeEqual(
		Buffer.from(validationToken),
		Buffer.from(expected),
	);
}
