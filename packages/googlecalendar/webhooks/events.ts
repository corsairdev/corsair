import { logEventFromContext } from 'corsair/core';
import { makeCalendarRequest } from '../client';
import type { GoogleCalendarWebhooks } from '../index';
import type { GoogleCalendarEvent } from '../schema/database';
import type { Event, EventListResponse } from '../types';
import type {
	EventDeletedEvent,
	NoChangesEvent,
	SyncAcknowledgedEvent,
} from './types';
import {
	createGoogleCalendarWebhookMatcher,
	decodePubSubMessage,
} from './types';

const CALENDAR_ID_PATTERN = /\/calendars\/([^\/\?]+)/;
const CREATE_VS_UPDATE_THRESHOLD_MS = 5000;

type EventChangedContext = Parameters<
	GoogleCalendarWebhooks['onEventChanged']['handler']
>[0];

type CalendarSyncState = Record<string, string>;
type CalendarDelta = { items: Event[]; nextSyncToken?: string };

function parseResourceUri(resourceUri: string) {
	const calendarMatch = resourceUri.match(CALENDAR_ID_PATTERN)?.[1];
	const calendarId = calendarMatch
		? decodeURIComponent(calendarMatch)
		: undefined;

	return { calendarId };
}

function isNewEvent(event: Event): boolean {
	if (!event.created || !event.updated) return false;
	const diff = Math.abs(
		new Date(event.updated).getTime() - new Date(event.created).getTime(),
	);
	return diff < CREATE_VS_UPDATE_THRESHOLD_MS;
}

function slimEventForEventLog(event: Event) {
	return {
		id: event.id,
		summary: event.summary,
		status: event.status,
		updated: event.updated,
		start: event.start,
		end: event.end,
	};
}

function toStorableEvent(
	event: Event,
	calendarId: string,
): GoogleCalendarEvent {
	return {
		id: event.id!,
		calendarId,
		status: event.status,
		summary: event.summary,
		description: event.description,
		location: event.location,
		htmlLink: event.htmlLink,
		created: event.created,
		updated: event.updated,
		start: event.start,
		end: event.end,
		recurrence: event.recurrence,
		recurringEventId: event.recurringEventId,
		organizer: event.organizer,
		attendees: event.attendees,
		hangoutLink: event.hangoutLink,
		createdAt: new Date(),
	};
}

function parseSyncState(raw: string | null): CalendarSyncState {
	if (!raw) return {};
	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return {};
		}
		return parsed as CalendarSyncState;
	} catch {
		return {};
	}
}

async function loadSyncState(
	ctx: EventChangedContext,
): Promise<CalendarSyncState> {
	// TODO(corsair-compat, ~2026-07-14): remove guard once corsair with calendar_sync_state is required.
	if (typeof ctx.keys.get_calendar_sync_state !== 'function') {
		return {};
	}
	const raw = await ctx.keys.get_calendar_sync_state();
	return parseSyncState(raw);
}

async function saveSyncToken(
	ctx: EventChangedContext,
	calendarId: string,
	syncToken: string,
): Promise<void> {
	// TODO(corsair-compat, ~2026-07-14): remove guard once corsair with calendar_sync_state is required.
	if (typeof ctx.keys.set_calendar_sync_state !== 'function') {
		return;
	}
	const state = await loadSyncState(ctx);
	state[calendarId] = syncToken;
	await ctx.keys.set_calendar_sync_state(JSON.stringify(state));
}

async function clearSyncToken(
	ctx: EventChangedContext,
	calendarId: string,
): Promise<void> {
	// TODO(corsair-compat, ~2026-07-14): remove guard once corsair with calendar_sync_state is required.
	if (typeof ctx.keys.set_calendar_sync_state !== 'function') {
		return;
	}
	const state = await loadSyncState(ctx);
	delete state[calendarId];
	await ctx.keys.set_calendar_sync_state(JSON.stringify(state));
}

function getErrorStatus(error: unknown): number | undefined {
	if (!error || typeof error !== 'object') {
		return undefined;
	}
	if ('status' in error) {
		return Number((error as { status?: number }).status);
	}
	if ('statusCode' in error) {
		return Number((error as { statusCode?: number }).statusCode);
	}
	return undefined;
}

async function listCalendarEventsPages(
	credentials: string,
	calendarId: string,
	query: Record<string, string | number | boolean | undefined>,
): Promise<CalendarDelta> {
	const items: Event[] = [];
	let pageToken: string | undefined;
	let nextSyncToken: string | undefined;

	do {
		const response = await makeCalendarRequest<EventListResponse>(
			`/calendars/${encodeURIComponent(calendarId)}/events`,
			credentials,
			{
				method: 'GET',
				query: {
					...query,
					pageToken,
				},
			},
		);

		if (response.items?.length) {
			items.push(...response.items);
		}
		nextSyncToken = response.nextSyncToken ?? nextSyncToken;
		pageToken = response.nextPageToken;
	} while (pageToken);

	return { items, nextSyncToken };
}

async function bootstrapSyncToken(
	credentials: string,
	calendarId: string,
): Promise<CalendarDelta> {
	return listCalendarEventsPages(credentials, calendarId, {
		showDeleted: true,
		singleEvents: true,
	});
}

async function listChangedEvents(
	ctx: EventChangedContext,
	credentials: string,
	calendarId: string,
): Promise<CalendarDelta> {
	const syncToken = (await loadSyncState(ctx))[calendarId];

	if (!syncToken) {
		return bootstrapSyncToken(credentials, calendarId);
	}

	try {
		return await listCalendarEventsPages(credentials, calendarId, {
			syncToken,
			showDeleted: true,
			singleEvents: true,
		});
	} catch (error) {
		if (getErrorStatus(error) === 410) {
			await clearSyncToken(ctx, calendarId);
			return bootstrapSyncToken(credentials, calendarId);
		}

		throw error;
	}
}

async function handleDeletedEvent(
	ctx: EventChangedContext,
	calendarId: string,
	eventId: string,
): Promise<{ eventData: EventDeletedEvent; corsairEntityId: string }> {
	let corsairEntityId = '';

	if (eventId && ctx.db?.events) {
		if (!corsairEntityId) {
			// Fallback for corsair versions before findIdByEntityId shipped. TODO(corsair-compat, ~2026-07-14):
			// remove this ternary and use only:
			//   corsairEntityId = (await ctx.db.events.findIdByEntityId(eventId)) ?? '';
			corsairEntityId = ctx.db.events.findIdByEntityId
				? ((await ctx.db.events.findIdByEntityId(eventId)) ?? '')
				: ((await ctx.db.events.findByEntityId(eventId))?.id ?? '');
		}
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

	return { eventData, corsairEntityId };
}

async function handleUpsertEvent(
	ctx: EventChangedContext,
	calendarId: string,
	event: Event,
): Promise<{
	eventData:
		| {
				type: 'eventCreated';
				calendarId: string;
				event: Event;
				timestamp: string;
		  }
		| {
				type: 'eventUpdated';
				calendarId: string;
				event: Event;
				timestamp: string;
		  };
	corsairEntityId: string;
}> {
	let corsairEntityId = '';

	if (event.id && ctx.db?.events) {
		const entity = await ctx.db.events.upsertByEntityId(
			event.id,
			toStorableEvent(event, calendarId),
		);
		corsairEntityId = entity?.id ?? '';
	}

	const timestamp = new Date().toISOString();

	if (isNewEvent(event)) {
		const eventData = {
			type: 'eventCreated' as const,
			calendarId,
			event,
			timestamp,
		};

		await logEventFromContext(
			ctx,
			'googlecalendar.webhook.eventCreated',
			{
				type: 'eventCreated',
				calendarId,
				event: slimEventForEventLog(event),
				timestamp,
			},
			'completed',
		);

		return { eventData, corsairEntityId };
	}

	const eventData = {
		type: 'eventUpdated' as const,
		calendarId,
		event,
		timestamp,
	};

	await logEventFromContext(
		ctx,
		'googlecalendar.webhook.eventUpdated',
		{
			type: 'eventUpdated',
			calendarId,
			event: slimEventForEventLog(event),
			timestamp,
		},
		'completed',
	);

	return { eventData, corsairEntityId };
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

		const { calendarId } = parseResourceUri(notification.resourceUri);

		if (!calendarId) {
			return {
				success: false,
				error: 'Could not parse calendar ID from resource URI',
			};
		}

		const credentials = ctx.key;

		try {
			if (notification.resourceState === 'sync') {
				const { nextSyncToken } = await bootstrapSyncToken(
					credentials,
					calendarId,
				);
				if (nextSyncToken) {
					await saveSyncToken(ctx, calendarId, nextSyncToken);
				}
				return {
					success: true,
					data: {
						type: 'syncAcknowledged' as const,
						calendarId,
						timestamp: new Date().toISOString(),
					},
				};
			}

			const { items, nextSyncToken } = await listChangedEvents(
				ctx,
				credentials,
				calendarId,
			);

			if (items.length === 0) {
				if (nextSyncToken) {
					await saveSyncToken(ctx, calendarId, nextSyncToken);
				}
				return {
					success: true,
					corsairEntityId: '',
					data: {
						type: 'noChanges' as const,
						calendarId,
						timestamp: new Date().toISOString(),
					},
				};
			}

			let firstResponse:
				| {
						success: true;
						corsairEntityId: string;
						data:
							| EventDeletedEvent
							| SyncAcknowledgedEvent
							| NoChangesEvent
							| Awaited<ReturnType<typeof handleUpsertEvent>>['eventData'];
				  }
				| undefined;

			for (const event of items) {
				if (!event.id) continue;

				if (event.status === 'cancelled') {
					const { eventData, corsairEntityId } = await handleDeletedEvent(
						ctx,
						calendarId,
						event.id,
					);
					if (!firstResponse) {
						firstResponse = {
							success: true,
							corsairEntityId,
							data: eventData,
						};
					}
					continue;
				}

				const { eventData, corsairEntityId } = await handleUpsertEvent(
					ctx,
					calendarId,
					event,
				);
				if (!firstResponse) {
					firstResponse = {
						success: true,
						corsairEntityId,
						data: eventData,
					};
				}
			}

			if (nextSyncToken) {
				await saveSyncToken(ctx, calendarId, nextSyncToken);
			}

			return (
				firstResponse ?? {
					success: true,
					corsairEntityId: '',
					data: {
						type: 'noChanges' as const,
						calendarId,
						timestamp: new Date().toISOString(),
					},
				}
			);
		} catch (error) {
			console.error('Failed to process webhook:', error);
			return {
				success: false,
				error: `Failed to process event: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
