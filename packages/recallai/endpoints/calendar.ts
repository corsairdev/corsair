import { logEventFromContext } from 'corsair/core';
import { makeRecallaiContextRequest } from '../client';
import type { RecallaiEndpoints } from '../index';
import {
	CalendarAuthenticateInputSchema,
	CalendarDisconnectInputSchema,
	CalendarEventBotInputSchema,
	CalendarEventInputSchema,
	CalendarEventsListInputSchema,
	CalendarMeetingInputSchema,
	CalendarMeetingsListInputSchema,
	CalendarMeetingUpdateInputSchema,
	CalendarUserAuthInputSchema,
	CalendarUsersListInputSchema,
	CalendarUserUpdateInputSchema,
} from './calendar-types';

const request = async <T>(
	ctx: Parameters<RecallaiEndpoints['authenticateCalendar']>[0],
	endpoint: string,
	operation: string,
	options: Parameters<typeof makeRecallaiContextRequest>[2] = {},
	calendarAuthToken?: string,
) => {
	const result = await makeRecallaiContextRequest<T>(ctx, endpoint, {
		...options,
		...(calendarAuthToken
			? { headers: { 'x-recallcalendarauthtoken': calendarAuthToken } }
			: {}),
	});
	await logEventFromContext(ctx, operation, {}, 'completed');
	return result;
};

export const authenticateCalendar: RecallaiEndpoints['authenticateCalendar'] =
	async (ctx, input) =>
		request(
			ctx,
			'/api/v1/calendar/authenticate/',
			'recallai.calendar.authenticate',
			{ method: 'POST', body: CalendarAuthenticateInputSchema.parse(input) },
		);

export const listCalendarMeetings: RecallaiEndpoints['listCalendarMeetings'] =
	async (ctx, input) => {
		const { calendar_auth_token, ...query } =
			CalendarMeetingsListInputSchema.parse(input);
		return request(
			ctx,
			'/api/v1/calendar/meetings/',
			'recallai.calendar.meetings.list',
			{ method: 'GET', query },
			calendar_auth_token,
		);
	};

export const retrieveCalendarMeeting: RecallaiEndpoints['retrieveCalendarMeeting'] =
	async (ctx, input) => {
		const parsed = CalendarMeetingInputSchema.parse(input);
		return request(
			ctx,
			`/api/v1/calendar/meetings/${encodeURIComponent(parsed.id)}/`,
			'recallai.calendar.meetings.retrieve',
			{},
			parsed.calendar_auth_token,
		);
	};

export const updateCalendarMeeting: RecallaiEndpoints['updateCalendarMeeting'] =
	async (ctx, input) => {
		const { id, calendar_auth_token, ...body } =
			CalendarMeetingUpdateInputSchema.parse(input);
		return request(
			ctx,
			`/api/v1/calendar/meetings/${encodeURIComponent(id)}/`,
			'recallai.calendar.meetings.update',
			{ method: 'PUT', body },
			calendar_auth_token,
		);
	};

export const refreshCalendarMeetings: RecallaiEndpoints['refreshCalendarMeetings'] =
	async (ctx, input) => {
		const { calendar_auth_token } = CalendarUserAuthInputSchema.parse(input);
		return request(
			ctx,
			'/api/v1/calendar/meetings/refresh/',
			'recallai.calendar.meetings.refresh',
			{ method: 'POST' },
			calendar_auth_token,
		);
	};

export const retrieveCalendarUser: RecallaiEndpoints['retrieveCalendarUser'] =
	async (ctx, input) => {
		const { calendar_auth_token } = CalendarUserAuthInputSchema.parse(input);
		return request(
			ctx,
			'/api/v1/calendar/user/',
			'recallai.calendar.user.retrieve',
			{},
			calendar_auth_token,
		);
	};

export const updateCalendarUser: RecallaiEndpoints['updateCalendarUser'] =
	async (ctx, input) => {
		const { calendar_auth_token, ...body } =
			CalendarUserUpdateInputSchema.parse(input);
		return request(
			ctx,
			'/api/v1/calendar/user/',
			'recallai.calendar.user.update',
			{ method: 'PUT', body },
			calendar_auth_token,
		);
	};

export const deleteCalendarUser: RecallaiEndpoints['deleteCalendarUser'] =
	async (ctx, input) => {
		const { calendar_auth_token } = CalendarUserAuthInputSchema.parse(input);
		await request<undefined>(
			ctx,
			'/api/v1/calendar/user/',
			'recallai.calendar.user.delete',
			{ method: 'DELETE' },
			calendar_auth_token,
		);
	};

export const disconnectCalendarPlatform: RecallaiEndpoints['disconnectCalendarPlatform'] =
	async (ctx, input) => {
		const { calendar_auth_token, ...body } =
			CalendarDisconnectInputSchema.parse(input);
		return request(
			ctx,
			'/api/v1/calendar/user/disconnect/',
			'recallai.calendar.user.disconnect',
			{ method: 'POST', body },
			calendar_auth_token,
		);
	};

export const listCalendarUsers: RecallaiEndpoints['listCalendarUsers'] = async (
	ctx,
	input,
) =>
	request(ctx, '/api/v1/calendar/users/', 'recallai.calendar.users.list', {
		method: 'GET',
		query: CalendarUsersListInputSchema.parse(input),
	});

export const listCalendarEvents: RecallaiEndpoints['listCalendarEvents'] =
	async (ctx, input) =>
		request(ctx, '/api/v2/calendar-events/', 'recallai.calendarEvents.list', {
			method: 'GET',
			query: CalendarEventsListInputSchema.parse(input),
		});

export const retrieveCalendarEvent: RecallaiEndpoints['retrieveCalendarEvent'] =
	async (ctx, input) => {
		const parsed = CalendarEventInputSchema.parse(input);
		return request(
			ctx,
			`/api/v2/calendar-events/${encodeURIComponent(parsed.id)}/`,
			'recallai.calendarEvents.retrieve',
		);
	};

export const scheduleBotForCalendarEvent: RecallaiEndpoints['scheduleBotForCalendarEvent'] =
	async (ctx, input) => {
		const { id, ...body } = CalendarEventBotInputSchema.parse(input);
		return request(
			ctx,
			`/api/v2/calendar-events/${encodeURIComponent(id)}/bot/`,
			'recallai.calendarEvents.scheduleBot',
			{ method: 'POST', body },
		);
	};

export const unscheduleBotForCalendarEvent: RecallaiEndpoints['unscheduleBotForCalendarEvent'] =
	async (ctx, input) => {
		const parsed = CalendarEventInputSchema.parse(input);
		return request(
			ctx,
			`/api/v2/calendar-events/${encodeURIComponent(parsed.id)}/bot/`,
			'recallai.calendarEvents.unscheduleBot',
			{ method: 'DELETE' },
		);
	};
