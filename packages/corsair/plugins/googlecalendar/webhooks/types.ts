import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from '../../../core/webhooks';
import type { Event } from '../types';

export type PubSubMessage = {
	data?: string;
	attributes?: Record<string, string>;
	messageId?: string;
	publishTime?: string;
};

export type PubSubNotification<TEvent = unknown> = {
	message?: PubSubMessage;
	subscription?: string;
	event?: TEvent;
};

export type GoogleCalendarPushNotification = {
	resourceId?: string;
	resourceState?: string;
	resourceUri?: string;
	channelId?: string;
	channelExpiration?: string;
	channelToken?: string;
	changed?: string;
};

export type EventCreatedEvent = {
	type: 'eventCreated';
	calendarId: string;
	event: Event;
	timestamp: string;
};

export type EventUpdatedEvent = {
	type: 'eventUpdated';
	calendarId: string;
	event: Event;
	timestamp: string;
};

export type EventDeletedEvent = {
	type: 'eventDeleted';
	calendarId: string;
	eventId: string;
	timestamp: string;
};

export type EventStartedEvent = {
	type: 'eventStarted';
	calendarId: string;
	event: Event;
	timestamp: string;
};

export type EventEndedEvent = {
	type: 'eventEnded';
	calendarId: string;
	event: Event;
	timestamp: string;
};

export type GoogleCalendarWebhookEvent =
	| EventCreatedEvent
	| EventUpdatedEvent
	| EventDeletedEvent
	| EventStartedEvent
	| EventEndedEvent;

export type GoogleCalendarEventName =
	| 'eventCreated'
	| 'eventUpdated'
	| 'eventDeleted'
	| 'eventStarted'
	| 'eventEnded';

export interface GoogleCalendarEventMap {
	eventCreated: EventCreatedEvent;
	eventUpdated: EventUpdatedEvent;
	eventDeleted: EventDeletedEvent;
	eventStarted: EventStartedEvent;
	eventEnded: EventEndedEvent;
}

export type GoogleCalendarWebhookPayload<TEvent = unknown> = PubSubNotification<TEvent>;

export type GoogleCalendarWebhookOutputs = {
	eventCreated: EventCreatedEvent;
	eventUpdated: EventUpdatedEvent;
	eventDeleted: EventDeletedEvent;
	eventStarted: EventStartedEvent;
	eventEnded: EventEndedEvent;
};

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

			if (!pushNotification.channelId || !pushNotification.resourceId) {
				return false;
			}

			const state = pushNotification.resourceState;

			if (state === 'sync') {
				return false;
			}

			if (eventType === 'eventDeleted') {
				return state === 'not_exists';
			}

			return state === 'exists' && !!pushNotification.resourceUri;
		} catch {
			return false;
		}
	};
}
