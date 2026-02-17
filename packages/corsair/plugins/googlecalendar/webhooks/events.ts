import { logEventFromContext } from '../../utils/events';
import type { GoogleCalendarWebhooks } from '..';
import { makeCalendarRequest } from '../client';
import type { Event } from '../types';
import type {
	EventCreatedEvent,
	EventDeletedEvent,
	EventUpdatedEvent,
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

async function fetchRecentlyUpdatedEvents(
	credentials: string,
	calendarId: string,
): Promise<Event[]> {
	const updatedMin = new Date(Date.now() - 2 * 60 * 1000).toISOString();
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
	return response.items || [];
}

export const onEventChanged: GoogleCalendarWebhooks['onEventChanged'] = {
	match: createGoogleCalendarWebhookMatcher('eventChanged'),
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
		const resourceState = pushNotification.resourceState;

		const calendarIdMatch = resourceUri.match(/\/calendars\/([^\/\?]+)/);
		if (!calendarIdMatch || !calendarIdMatch[1]) {
			return {
				success: false,
				error: 'Could not parse calendar ID from resource URI',
			};
		}

		const calendarId = calendarIdMatch[1];

		const eventIdMatch = resourceUri.match(
			/\/calendars\/[^\/]+\/events\/([^\/\?]+)/,
		);

		try {
			if (resourceState === 'not_exists') {
				let eventId = '';

				if (eventIdMatch && eventIdMatch[1]) {
					eventId = eventIdMatch[1];
				} else {
					const recentEvents = await fetchRecentlyUpdatedEvents(
						credentials,
						calendarId,
					);
					const deletedEvent = recentEvents.find(
						(e) => e.status === 'cancelled',
					);
					eventId = deletedEvent?.id || pushNotification.resourceId || '';
				}

				if (eventId && ctx.db.events) {
					await ctx.db.events.deleteByEntityId(eventId);
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
			}

			let event: Event;

			if (eventIdMatch && eventIdMatch[1]) {
				event = await fetchEvent(credentials, calendarId, eventIdMatch[1]);
			} else {
				const recentEvents = await fetchRecentlyUpdatedEvents(
					credentials,
					calendarId,
				);
				const latestEvent = recentEvents[recentEvents.length - 1];
				if (!latestEvent) {
					return {
						success: false,
						error: 'No recently updated events found in calendar',
					};
				}
				event = latestEvent;
			}

			if (event.status === 'cancelled') {
				const eventId = event.id || '';

				if (eventId && ctx.db.events) {
					await ctx.db.events.deleteByEntityId(eventId);
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
			}

			if (event.id && ctx.db.events) {
				await ctx.db.events.upsertByEntityId(event.id, {
					...event,
					id: event.id,
					calendarId,
					createdAt: new Date(),
				});
			}

			const isNewEvent =
				event.created &&
				event.updated &&
				Math.abs(
					new Date(event.updated).getTime() -
						new Date(event.created).getTime(),
				) < 5000;

			if (isNewEvent) {
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
			console.error('Failed to process webhook:', error);
			return {
				success: false,
				error: `Failed to process event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
