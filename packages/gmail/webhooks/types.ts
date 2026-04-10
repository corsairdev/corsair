import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';
import type { Message } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PubSubMessageSchema = z.object({
	data: z.string().optional(),
	attributes: z.record(z.string()).optional(),
	messageId: z.string().optional(),
	publishTime: z.string().optional(),
});
export type PubSubMessage = z.infer<typeof PubSubMessageSchema>;

export const PubSubNotificationSchema = z.object({
	message: PubSubMessageSchema.optional(),
	subscription: z.string().optional(),
	event: z.unknown().optional(),
});
export type PubSubNotification<TEvent = unknown> = Omit<
	z.infer<typeof PubSubNotificationSchema>,
	'event'
> & { event?: TEvent };

export const GmailPushNotificationSchema = z.object({
	emailAddress: z.string().optional(),
	historyId: z.string().optional(),
});
export type GmailPushNotification = z.infer<typeof GmailPushNotificationSchema>;

// z.custom<T>() is used for types imported from ../types to avoid duplicating
// those schemas here. It provides correct TypeScript types with no-op runtime validation.

export const MessageReceivedEventSchema = z.object({
	type: z.literal('messageReceived'),
	emailAddress: z.string(),
	historyId: z.string(),
	message: z.custom<Message>(),
});
export type MessageReceivedEvent = z.infer<typeof MessageReceivedEventSchema>;

export const MessageDeletedEventSchema = z.object({
	type: z.literal('messageDeleted'),
	emailAddress: z.string(),
	historyId: z.string(),
	message: z.custom<Message>(),
});
export type MessageDeletedEvent = z.infer<typeof MessageDeletedEventSchema>;

export const MessageLabelChangedEventSchema = z.object({
	type: z.literal('messageLabelChanged'),
	emailAddress: z.string(),
	historyId: z.string(),
	message: z.custom<Message>(),
	labelsAdded: z.array(z.string()).optional(),
	labelsRemoved: z.array(z.string()).optional(),
});
export type MessageLabelChangedEvent = z.infer<
	typeof MessageLabelChangedEventSchema
>;

export const GmailWebhookEventSchema = z.union([
	MessageReceivedEventSchema,
	MessageDeletedEventSchema,
	MessageLabelChangedEventSchema,
]);
export type GmailWebhookEvent = z.infer<typeof GmailWebhookEventSchema>;

export type GmailEventName = 'messageChanged';

export type GmailWebhookPayload<TEvent = unknown> = PubSubNotification<TEvent>;

export type GmailWebhookOutputs = {
	messageChanged:
		| MessageReceivedEvent
		| MessageDeletedEvent
		| MessageLabelChangedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function decodePubSubMessage(data: string): GmailPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

export function createGmailWebhookMatcher(
	eventType: GmailEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return !!pushNotification.historyId && !!pushNotification.emailAddress;
		} catch {
			return false;
		}
	};
}
