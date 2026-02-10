import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core/webhooks';
import { logEventFromContext } from '../../utils/events';
import type { GoogleCalendarContext } from '..';
import { makeCalendarRequest } from '../client';
import type { Event } from '../types';
import type {
	GoogleCalendarPushNotification,
	EventCreatedEvent,
	EventUpdatedEvent,
	EventDeletedEvent,
	EventStartedEvent,
	EventEndedEvent,
	PubSubNotification,
} from './types';

function decodePubSubMessage(data: string): GoogleCalendarPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

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

export const onEventCreated = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return pushNotification.resourceState === 'exists' && !!pushNotification.resourceUri;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleCalendarContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(/\/calendars\/([^\/]+)\/events\/(.+)/);
		
		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
				data: { success: false },
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
				data: { success: false },
			};
		}
	},
};

export const onEventUpdated = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return pushNotification.resourceState === 'exists' && 
				!!pushNotification.resourceUri && 
				!!pushNotification.changed;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleCalendarContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(/\/calendars\/([^\/]+)\/events\/(.+)/);
		
		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
				data: { success: false },
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
				data: { success: false },
			};
		}
	},
};

export const onEventDeleted = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return pushNotification.resourceState === 'not_exists' || 
				pushNotification.resourceState === 'sync';
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleCalendarContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(/\/calendars\/([^\/]+)\/events\/(.+)/);
		
		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
				data: { success: false },
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

export const onEventStarted = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return pushNotification.resourceState === 'exists' && !!pushNotification.resourceUri;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleCalendarContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(/\/calendars\/([^\/]+)\/events\/(.+)/);
		
		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
				data: { success: false },
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
					data: { success: false },
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
				data: { success: false },
			};
		}
	},
};

export const onEventEnded = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return pushNotification.resourceState === 'exists' && !!pushNotification.resourceUri;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GoogleCalendarContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.resourceUri) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;
		const resourceUri = pushNotification.resourceUri;
		const calendarIdMatch = resourceUri.match(/\/calendars\/([^\/]+)\/events\/(.+)/);
		
		if (!calendarIdMatch || !calendarIdMatch[1] || !calendarIdMatch[2]) {
			return {
				success: false,
				error: 'Could not parse calendar ID and event ID from resource URI',
				data: { success: false },
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
					data: { success: false },
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
				data: { success: false },
			};
		}
	},
};
