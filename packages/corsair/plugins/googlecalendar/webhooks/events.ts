import { logEventFromContext } from '../../utils/events';
import type { GoogleCalendarWebhooks } from '..';
import { makeCalendarRequest } from '../client';
import type { Event } from '../types';
import type {
	EventCreatedEvent,
	EventDeletedEvent,
	EventEndedEvent,
	EventStartedEvent,
	EventUpdatedEvent,
	PubSubNotification,
} from './types';
import {
	createGoogleCalendarWebhookMatcher,
	decodePubSubMessage,
} from './types';

async function fetchEvent(
	credentials: string,
	calendarId: string,
	eventId: string,
): Promise<Event> {
	return await makeCalendarRequest<Event>(
		`/calendars/${calendarId}/events/${eventId}`,
		credentials,
		{
			method: 'GET',
		},
	);
}

function isEventStarted(event: Event): boolean {
	if (!event.start?.dateTime) {
		return false;
	}
	const startTime = new Date(event.start.dateTime).getTime();
	const now = Date.now();
	return startTime <= now && startTime > now - 60000;
}

function isEventEnded(event: Event): boolean {
	if (!event.end?.dateTime) {
		return false;
	}
	const endTime = new Date(event.end.dateTime).getTime();
	const now = Date.now();
	return endTime <= now && endTime > now - 60000;
}

export const onEventCreated: GoogleCalendarWebhooks['onEventCreated'] = {
	match: createGoogleCalendarWebhookMatcher('eventCreated'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(
			/\/calendars\/([^\/]+)\/events\/(.+)/,
		);

		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
			};
		}

		const calendarId = calendarIdMatch[1];
		const eventId = calendarIdMatch[2];

		try {
			const event = await fetchEvent(credentials, calendarId, eventId);

			if (event.id && ctx.db.events) {
				try {
					await ctx.db.events.upsertByEntityId(event.id, {
						...event,
						id: event.id,
						calendarId,
						createdAt: new Date(),
					});
				} catch (error) {
					console.warn('Failed to save event to database:', error);
				}
			}

			const eventData: EventCreatedEvent = {
				type: 'eventCreated',
				calendarId,
				event,
				timestamp: new Date().toISOString(),
			};

			await logEventFromContext(
				ctx,
				'googlecalendar.webhook.eventCreated',
				{ ...eventData },
				'completed',
			);

			return {
				success: true,
				data: eventData,
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to fetch event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};

export const onEventUpdated: GoogleCalendarWebhooks['onEventUpdated'] = {
	match: createGoogleCalendarWebhookMatcher('eventUpdated'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(
			/\/calendars\/([^\/]+)\/events\/(.+)/,
		);

		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
			};
		}

		const calendarId = calendarIdMatch[1];
		const eventId = calendarIdMatch[2];

		try {
			const event = await fetchEvent(credentials, calendarId, eventId);

			if (event.id && ctx.db.events) {
				try {
					await ctx.db.events.upsertByEntityId(event.id, {
						...event,
						id: event.id,
						calendarId,
						createdAt: new Date(),
					});
				} catch (error) {
					console.warn('Failed to save event to database:', error);
				}
			}

			const eventData: EventUpdatedEvent = {
				type: 'eventUpdated',
				calendarId,
				event,
				timestamp: new Date().toISOString(),
			};

			await logEventFromContext(
				ctx,
				'googlecalendar.webhook.eventUpdated',
				{ ...eventData },
				'completed',
			);

			return {
				success: true,
				data: eventData,
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to fetch event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};

export const onEventDeleted: GoogleCalendarWebhooks['onEventDeleted'] = {
	match: createGoogleCalendarWebhookMatcher('eventDeleted'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(
			/\/calendars\/([^\/]+)\/events\/(.+)/,
		);

		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
			};
		}

		const calendarId = calendarIdMatch[1];
		const eventId = calendarIdMatch[2];

		if (ctx.db.events) {
			try {
				await ctx.db.events.deleteByEntityId(eventId);
			} catch (error) {
				console.warn('Failed to delete event from database:', error);
			}
		}

		const eventData: EventDeletedEvent = {
			type: 'eventDeleted',
			calendarId,
			eventId,
			timestamp: new Date().toISOString(),
		};

		await logEventFromContext(
			ctx,
			'googlecalendar.webhook.eventDeleted',
			{ ...eventData },
			'completed',
		);

		return {
			success: true,
			data: eventData,
		};
	},
};

export const onEventStarted: GoogleCalendarWebhooks['onEventStarted'] = {
	match: createGoogleCalendarWebhookMatcher('eventStarted'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(
			/\/calendars\/([^\/]+)\/events\/(.+)/,
		);

		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
			};
		}

		const calendarId = calendarIdMatch[1];
		const eventId = calendarIdMatch[2];

		try {
			const event = await fetchEvent(credentials, calendarId, eventId);

			if (!isEventStarted(event)) {
				return {
					success: false,
					error: 'Event has not started yet',
				};
			}

			const eventData: EventStartedEvent = {
				type: 'eventStarted',
				calendarId,
				event,
				timestamp: new Date().toISOString(),
			};

			await logEventFromContext(
				ctx,
				'googlecalendar.webhook.eventStarted',
				{ ...eventData },
				'completed',
			);

			return {
				success: true,
				data: eventData,
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to fetch event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};

export const onEventEnded: GoogleCalendarWebhooks['onEventEnded'] = {
	match: createGoogleCalendarWebhookMatcher('eventEnded'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(
			/\/calendars\/([^\/]+)\/events\/(.+)/,
		);

		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
			};
		}

		const calendarId = calendarIdMatch[1];
		const eventId = calendarIdMatch[2];

		try {
			const event = await fetchEvent(credentials, calendarId, eventId);

			if (!isEventEnded(event)) {
				return {
					success: false,
					error: 'Event has not ended yet',
				};
			}

			const eventData: EventEndedEvent = {
				type: 'eventEnded',
				calendarId,
				event,
				timestamp: new Date().toISOString(),
			};

			await logEventFromContext(
				ctx,
				'googlecalendar.webhook.eventEnded',
				{ ...eventData },
				'completed',
			);

			return {
				success: true,
				data: eventData,
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to fetch event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
