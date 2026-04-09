import { logEventFromContext } from 'corsair/core';
import type { OutlookEndpoints } from '..';
import { makeOutlookRequest } from '../client';
import type { OutlookEndpointOutputs } from './types';

const userPath = (userId?: string) => (userId ? `/users/${userId}` : '/me');

// ── DB record helper ──────────────────────────────────────────────────────────

const toEventRecord = (
	event: OutlookEndpointOutputs['eventsGet'],
	calendarId?: string,
) => ({
	// id is asserted non-null — all callers guard with `if (result.id)` before invoking this helper
	id: event.id!,
	subject: event.subject,
	bodyPreview: event.bodyPreview,
	start: event.start ? JSON.stringify(event.start) : undefined,
	end: event.end ? JSON.stringify(event.end) : undefined,
	isAllDay: event.isAllDay,
	isCancelled: event.isCancelled,
	isOrganizer: event.isOrganizer,
	isOnlineMeeting: event.isOnlineMeeting,
	location: event.location?.displayName,
	calendarId,
	organizer: event.organizer ? JSON.stringify(event.organizer) : undefined,
	importance: event.importance,
	sensitivity: event.sensitivity,
	showAs: event.showAs,
	webLink: event.webLink,
	createdAt: event.createdDateTime
		? new Date(event.createdDateTime)
		: undefined,
});

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const createEvent: OutlookEndpoints['eventsCreate'] = async (
	ctx,
	input,
) => {
	const base = userPath(input.user_id);
	const calendarPath = input.calendar_id
		? `/calendars/${input.calendar_id}`
		: '';

	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['eventsCreate']
	>(`${base}${calendarPath}/events`, ctx.key, {
		method: 'POST',
		body: {
			subject: input.subject,
			start: { dateTime: input.start_datetime, timeZone: input.time_zone },
			end: { dateTime: input.end_datetime, timeZone: input.time_zone },
			...(input.body && {
				body: {
					contentType: input.is_html ? 'HTML' : 'Text',
					content: input.body,
				},
			}),
			...(input.location && { location: { displayName: input.location } }),
			...(input.attendees_info?.length && {
				attendees: input.attendees_info.map((a) => ({
					type: a.type ?? 'required',
					emailAddress: { address: a.email, name: a.name },
				})),
			}),
			...(input.is_online_meeting !== undefined && {
				isOnlineMeeting: input.is_online_meeting,
			}),
			...(input.online_meeting_provider && {
				onlineMeetingProvider: input.online_meeting_provider,
			}),
			...(input.show_as && { showAs: input.show_as }),
			...(input.categories?.length && { categories: input.categories }),
			...(input.importance && { importance: input.importance }),
		},
	});

	if (result.id && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(
				result.id,
				toEventRecord(result, input.calendar_id),
			);
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.events.create',
		{ subject: input.subject },
		'completed',
	);
	return result;
};

export const getEvent: OutlookEndpoints['eventsGet'] = async (ctx, input) => {
	const base = userPath(input.user_id);
	const calendarPath = input.calendar_id
		? `/calendars/${input.calendar_id}`
		: '';
	const result = await makeOutlookRequest<OutlookEndpointOutputs['eventsGet']>(
		`${base}${calendarPath}/events/${input.event_id}`,
		ctx.key,
	);

	if (result.id && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(
				result.id,
				toEventRecord(result, input.calendar_id),
			);
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.events.get',
		{ event_id: input.event_id },
		'completed',
	);
	return result;
};

export const listEvents: OutlookEndpoints['eventsList'] = async (
	ctx,
	input,
) => {
	const base = userPath(input.user_id);
	const calendarPath = input.calendar_id
		? `/calendars/${input.calendar_id}`
		: '';

	const result = await makeOutlookRequest<OutlookEndpointOutputs['eventsList']>(
		`${base}${calendarPath}/events`,
		ctx.key,
		{
			query: {
				...(input.top && { $top: input.top }),
				...(input.skip && { $skip: input.skip }),
				...(input.filter && { $filter: input.filter }),
				...(input.select?.length && { $select: input.select.join(',') }),
				...(input.orderby?.length && { $orderby: input.orderby.join(',') }),
				...(input.timezone && {
					Prefer: `outlook.timezone="${input.timezone}"`,
				}),
			},
		},
	);

	if (result.value?.length && ctx.db.events) {
		try {
			for (const event of result.value) {
				if (event.id) {
					await ctx.db.events.upsertByEntityId(
						event.id,
						toEventRecord(event, input.calendar_id),
					);
				}
			}
		} catch (error) {
			console.warn('Failed to save events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.events.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateEvent: OutlookEndpoints['eventsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['eventsUpdate']
	>(`${userPath(input.user_id)}/events/${input.event_id}`, ctx.key, {
		method: 'PATCH',
		body: {
			...(input.subject && { subject: input.subject }),
			...(input.body && { body: input.body }),
			...(input.start_datetime &&
				input.time_zone && {
					start: { dateTime: input.start_datetime, timeZone: input.time_zone },
				}),
			...(input.end_datetime &&
				input.time_zone && {
					end: { dateTime: input.end_datetime, timeZone: input.time_zone },
				}),
			...(input.location && { location: { displayName: input.location } }),
			...(input.attendees && { attendees: input.attendees }),
			...(input.show_as && { showAs: input.show_as }),
			...(input.categories && { categories: input.categories }),
		},
	});

	if (result.id && ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(result.id, toEventRecord(result));
		} catch (error) {
			console.warn('Failed to update event in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.events.update',
		{ event_id: input.event_id },
		'completed',
	);
	return result;
};

export const deleteEvent: OutlookEndpoints['eventsDelete'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/events/${input.event_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.events) {
		try {
			await ctx.db.events.deleteByEntityId(input.event_id);
		} catch (error) {
			console.warn('Failed to delete event from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.events.delete',
		{ event_id: input.event_id },
		'completed',
	);
	return { success: true };
};

export const cancelEvent: OutlookEndpoints['eventsCancel'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`/users/${input.user_id}/calendars/${input.calendar_id}/events/${input.event_id}/cancel`,
		ctx.key,
		{
			method: 'POST',
			body: { Comment: input.Comment ?? '' },
		},
	);

	if (ctx.db.events) {
		try {
			await ctx.db.events.upsertByEntityId(input.event_id, {
				id: input.event_id,
				isCancelled: true,
			});
		} catch (error) {
			console.warn('Failed to update cancelled event in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.events.cancel',
		{ event_id: input.event_id },
		'completed',
	);
	return {
		success: true,
		message: 'Event cancelled',
		user_id: input.user_id,
		event_id: input.event_id,
		calendar_id: input.calendar_id,
	};
};

export const declineEvent: OutlookEndpoints['eventsDecline'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/events/${input.event_id}/decline`,
		ctx.key,
		{
			method: 'POST',
			body: {
				...(input.comment && { comment: input.comment }),
				...(input.sendResponse !== undefined && {
					sendResponse: input.sendResponse,
				}),
				...(input.proposedNewTime && {
					proposedNewTime: input.proposedNewTime,
				}),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'outlook.events.decline',
		{ event_id: input.event_id },
		'completed',
	);
	return { success: true, message: 'Event declined' };
};

export const findMeetingTimes: OutlookEndpoints['eventsFindMeetingTimes'] =
	async (ctx, input) => {
		const result = await makeOutlookRequest<
			OutlookEndpointOutputs['eventsFindMeetingTimes']
		>(`${userPath(input.user_id)}/findMeetingTimes`, ctx.key, {
			method: 'POST',
			body: {
				...(input.attendees && { attendees: input.attendees }),
				...(input.timeConstraint && { timeConstraint: input.timeConstraint }),
				...(input.locationConstraint && {
					locationConstraint: input.locationConstraint,
				}),
				...(input.meetingDuration && {
					meetingDuration: input.meetingDuration,
				}),
				...(input.maxCandidates && { maxCandidates: input.maxCandidates }),
				...(input.isOrganizerOptional !== undefined && {
					isOrganizerOptional: input.isOrganizerOptional,
				}),
				...(input.returnSuggestionReasons !== undefined && {
					returnSuggestionReasons: input.returnSuggestionReasons,
				}),
				...(input.minimumAttendeePercentage !== undefined && {
					minimumAttendeePercentage: input.minimumAttendeePercentage,
				}),
			},
		});

		await logEventFromContext(
			ctx,
			'outlook.events.findMeetingTimes',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getSchedule: OutlookEndpoints['eventsGetSchedule'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['eventsGetSchedule']
	>(`/me/calendars/${input.calendar_id}/getSchedule`, ctx.key, {
		method: 'POST',
		body: {
			schedules: input.schedules,
			startTime: input.startTime,
			endTime: input.endTime,
			availabilityViewInterval: input.availabilityViewInterval ?? 30,
		},
	});

	await logEventFromContext(
		ctx,
		'outlook.events.getSchedule',
		{ calendar_id: input.calendar_id },
		'completed',
	);
	return result;
};
