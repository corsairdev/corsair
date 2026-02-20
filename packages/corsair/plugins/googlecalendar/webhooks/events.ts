import { logEventFromContext } from '../../utils/events';
import type { GoogleCalendarWebhooks } from '..';
import { makeCalendarRequest } from '../client';
import type { Event } from '../types';
import type {
	EventDeletedEvent,
	GoogleCalendarPushNotification,
} from './types';
import {
	createGoogleCalendarWebhookMatcher,
	decodePubSubMessage,
} from './types';

const CALENDAR_ID_PATTERN = /\/calendars\/([^\/\?]+)/;
const EVENT_ID_PATTERN = /\/calendars\/[^\/]+\/events\/([^\/\?]+)/;
const RECENT_EVENTS_WINDOW_MS = 2 * 60 * 1000;
const CREATE_VS_UPDATE_THRESHOLD_MS = 5000;

function parseResourceUri(resourceUri: string) {
	return {
		calendarId: resourceUri.match(CALENDAR_ID_PATTERN)?.[1],
		eventId: resourceUri.match(EVENT_ID_PATTERN)?.[1],
	};
}

function isNewEvent(event: Event): boolean {
	if (!event.created || !event.updated) return false;
	const diff = Math.abs(
		new Date(event.updated).getTime() - new Date(event.created).getTime(),
	);
	return diff < CREATE_VS_UPDATE_THRESHOLD_MS;
}

function fetchEvent(
	credentials: string,
	calendarId: string,
	eventId: string,
): Promise<Event> {
	return makeCalendarRequest<Event>(
		`/calendars/${calendarId}/events/${eventId}`,
		credentials,
		{ method: 'GET' },
	);
}

async function fetchRecentlyUpdatedEvents(
	credentials: string,
	calendarId: string,
): Promise<Event[]> {
	const updatedMin = new Date(
		Date.now() - RECENT_EVENTS_WINDOW_MS,
	).toISOString();
	const response = await makeCalendarRequest<{ items?: Event[] }>(
		`/calendars/${calendarId}/events`,
		credentials,
		{
			method: 'GET',
			query: {
				maxResults: 10,
				orderBy: 'updated',
				updatedMin,
				showDeleted: true,
			},
		},
	);
	return response.items ?? [];
}

async function resolveEvent(
	credentials: string,
	calendarId: string,
	eventId: string | undefined,
): Promise<Event | null> {
	if (eventId) {
		return fetchEvent(credentials, calendarId, eventId);
	}
	const recentEvents = await fetchRecentlyUpdatedEvents(
		credentials,
		calendarId,
	);
	return recentEvents.at(-1) ?? null;
}

async function resolveDeletedEventId(
	credentials: string,
	calendarId: string,
	eventId: string | undefined,
	notification: GoogleCalendarPushNotification,
): Promise<string> {
	if (eventId) return eventId;
	const recentEvents = await fetchRecentlyUpdatedEvents(
		credentials,
		calendarId,
	);
	const cancelled = recentEvents.find((e) => e.status === 'cancelled');
	return cancelled?.id ?? notification.resourceId ?? '';
}

async function handleDeletedEvent(
	ctx: Parameters<GoogleCalendarWebhooks['onEventChanged']['handler']>[0],
	calendarId: string,
	eventId: string,
): Promise<{ eventData: EventDeletedEvent }> {
	if (eventId && ctx.db.events) {
		await ctx.db.events.deleteByEntityId(eventId);
	}

	const eventData = {
		type: 'eventDeleted' as const,
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

	return { eventData };
}

export const onEventChanged: GoogleCalendarWebhooks['onEventChanged'] = {
	match: createGoogleCalendarWebhookMatcher('eventChanged'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return { success: false, error: 'No message data in notification' };
		}

		const notification = decodePubSubMessage(body.message.data);

		if (!notification.resourceUri) {
			return { success: false, error: 'Invalid push notification format' };
		}

		const { calendarId, eventId } = parseResourceUri(notification.resourceUri);

		if (!calendarId) {
			return {
				success: false,
				error: 'Could not parse calendar ID from resource URI',
			};
		}

		const credentials = ctx.key;

		try {
			if (notification.resourceState === 'not_exists') {
				const deletedEventId = await resolveDeletedEventId(
					credentials,
					calendarId,
					eventId,
					notification,
				);
				const { eventData } = await handleDeletedEvent(
					ctx,
					calendarId,
					deletedEventId,
				);
				return { success: true, data: eventData };
			}

			const event = await resolveEvent(credentials, calendarId, eventId);

			if (!event) {
				return {
					success: false,
					error: 'No recently updated events found in calendar',
				};
			}

			if (event.status === 'cancelled') {
				const { eventData } = await handleDeletedEvent(
					ctx,
					calendarId,
					event.id ?? '',
				);
				return { success: true, data: eventData };
			}

			let corsairEntityId = '';

			if (event.id && ctx.db.events) {
				const entity = await ctx.db.events.upsertByEntityId(event.id, {
					...event,
					id: event.id,
					calendarId,
					createdAt: new Date(),
				});
				corsairEntityId = entity?.id ?? '';
			}

			if (isNewEvent(event)) {
				const eventData = {
					type: 'eventCreated' as const,
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

				return { success: true, corsairEntityId, data: eventData };
			}

			const eventData = {
				type: 'eventUpdated' as const,
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

			return { success: true, corsairEntityId, data: eventData };
		} catch (error) {
			console.error('Failed to process webhook:', error);
			return {
				success: false,
				error: `Failed to process event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
