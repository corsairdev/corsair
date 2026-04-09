import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';
import type { Event } from '../types';

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

export const GoogleCalendarPushNotificationSchema = z.object({
	resourceId: z.string().optional(),
	resourceState: z.string().optional(),
	resourceUri: z.string().optional(),
	channelId: z.string().optional(),
	channelExpiration: z.string().optional(),
	channelToken: z.string().optional(),
	changed: z.string().optional(),
});
export type GoogleCalendarPushNotification = z.infer<
	typeof GoogleCalendarPushNotificationSchema
>;

// z.custom<T>() is used for the Event type imported from ../types to avoid
// duplicating the large schema here. Provides correct TypeScript types with
// no-op runtime validation.

export const EventCreatedEventSchema = z.object({
	type: z.literal('eventCreated'),
	calendarId: z.string(),
	event: z.custom<Event>(),
	timestamp: z.string(),
});
export type EventCreatedEvent = z.infer<typeof EventCreatedEventSchema>;

export const EventUpdatedEventSchema = z.object({
	type: z.literal('eventUpdated'),
	calendarId: z.string(),
	event: z.custom<Event>(),
	timestamp: z.string(),
});
export type EventUpdatedEvent = z.infer<typeof EventUpdatedEventSchema>;

export const EventDeletedEventSchema = z.object({
	type: z.literal('eventDeleted'),
	calendarId: z.string(),
	eventId: z.string(),
	timestamp: z.string(),
});
export type EventDeletedEvent = z.infer<typeof EventDeletedEventSchema>;

export const GoogleCalendarWebhookEventSchema = z.union([
	EventCreatedEventSchema,
	EventUpdatedEventSchema,
	EventDeletedEventSchema,
]);
export type GoogleCalendarWebhookEvent = z.infer<
	typeof GoogleCalendarWebhookEventSchema
>;

export type GoogleCalendarEventName = 'eventChanged';

export interface GoogleCalendarEventMap {
	eventChanged: EventCreatedEvent | EventUpdatedEvent | EventDeletedEvent;
}

export type GoogleCalendarWebhookPayload<TEvent = unknown> =
	PubSubNotification<TEvent>;

export type GoogleCalendarWebhookOutputs = {
	eventChanged: EventCreatedEvent | EventUpdatedEvent | EventDeletedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function decodePubSubMessage(
	data: string,
): GoogleCalendarPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

export function createGoogleCalendarWebhookMatcher(
	eventType: GoogleCalendarEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);

			return (
				!!pushNotification.channelId &&
				!!pushNotification.resourceId &&
				!!pushNotification.resourceUri &&
				pushNotification.resourceUri.includes('/calendar/')
			);
		} catch {
			return false;
		}
	};
}
