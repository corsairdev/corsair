import type { Event } from '../types';

export type PubSubMessage = {
	data?: string;
	attributes?: Record<string, string>;
	messageId?: string;
	publishTime?: string;
};

export type PubSubNotification = {
	message?: PubSubMessage;
	subscription?: string;
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

export type GoogleCalendarWebhookPayload = PubSubNotification;

export type GoogleCalendarWebhookOutputs = {
	eventCreated: EventCreatedEvent;
	eventUpdated: EventUpdatedEvent;
	eventDeleted: EventDeletedEvent;
	eventStarted: EventStartedEvent;
	eventEnded: EventEndedEvent;
};
