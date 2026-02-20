import { logEventFromContext } from '../../utils/events';
import type { GoogleCalendarEndpoints } from '..';
import { makeCalendarRequest } from '../client';
import type { GoogleCalendarEndpointOutputs } from './types';

export const create: GoogleCalendarEndpoints['eventsCreate'] = async (
	ctx,
	input,
) => {
	const calendarId = input.calendarId || 'primary';
	const result = await makeCalendarRequest<
		GoogleCalendarEndpointOutputs['eventsCreate']
	>(`/calendars/${calendarId}/events`, ctx.key, {
		method: 'POST',
		body: input.event,
	});

	if (result.id && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				calendarId,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlecalendar.events.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleCalendarEndpoints['eventsGet'] = async (ctx, input) => {
	const calendarId = input.calendarId || 'primary';
	const result = await makeCalendarRequest<
		GoogleCalendarEndpointOutputs['eventsGet']
	>(`/calendars/${calendarId}/events/${input.id}`, ctx.key, {
		method: 'GET',
		query: {
			timeZone: input.timeZone,
			maxAttendees: input.maxAttendees,
		},
	});

	if (result.id && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				calendarId,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlecalendar.events.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: GoogleCalendarEndpoints['eventsGetMany'] = async (
	ctx,
	input,
) => {
	const calendarId = input.calendarId || 'primary';
	const result = await makeCalendarRequest<
		GoogleCalendarEndpointOutputs['eventsGetMany']
	>(`/calendars/${calendarId}/events`, ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.items && ctx.db.events) {
		try {
			for (const event of result.items) {
				if (event.id) {
					await ctx.db.events.upsertByEntityId(event.id, {
						...event,
						id: event.id,
						calendarId,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlecalendar.events.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleCalendarEndpoints['eventsUpdate'] = async (
	ctx,
	input,
) => {
	const calendarId = input.calendarId || 'primary';
	const result = await makeCalendarRequest<
		GoogleCalendarEndpointOutputs['eventsUpdate']
	>(`/calendars/${calendarId}/events/${input.id}`, ctx.key, {
		method: 'PUT',
		body: input.event,
		query: {
			sendUpdates: input.sendUpdates,
			sendNotifications: input.sendNotifications,
			conferenceDataVersion: input.conferenceDataVersion,
			maxAttendees: input.maxAttendees,
			supportsAttachments: input.supportsAttachments,
		},
	});

	if (result.id && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				calendarId,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlecalendar.events.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteEvent: GoogleCalendarEndpoints['eventsDelete'] = async (
	ctx,
	input,
) => {
	const calendarId = input.calendarId || 'primary';
	await makeCalendarRequest<GoogleCalendarEndpointOutputs['eventsDelete']>(
		`/calendars/${calendarId}/events/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
			query: {
				sendUpdates: input.sendUpdates,
				sendNotifications: input.sendNotifications,
			},
		},
	);

	if (ctx.db.events) {
		try {
			await ctx.db.events.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete event from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlecalendar.events.delete',
		{ ...input },
		'completed',
	);
};
