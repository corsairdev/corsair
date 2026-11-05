import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeRecallaiContextRequest } from '../client';
import type { RecallaiContext } from '../index';
import type { RecallaiJsonValue } from '../json';

const calendarId = z.string().uuid();
const platform = z.enum(['google_calendar', 'microsoft_outlook']);
const status = z.enum(['connected', 'connecting', 'disconnected']);

// Response enums stay open so a value Recall adds later does not fail the
// call; inputs keep the documented values.
const CalendarStatusChangeSchema = z.object({
	status: status.or(z.string()),
	created_at: z.string().datetime(),
	reason: z.string(),
});

export const CalendarResponseSchema = z
	.object({
		id: calendarId,
		metadata: z.record(z.string(), z.string()).optional(),
		oauth_client_id: z.string().max(2000),
		oauth_client_secret: z.string().max(2000).nullable().optional(),
		oauth_refresh_token: z.string().max(10000),
		platform: platform.or(z.string()),
		oauth_email: z.string().email().max(2000).optional(),
		platform_email: z.string().nullable(),
		status: z.string(),
		status_changes: z.array(CalendarStatusChangeSchema),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
	})
	.passthrough();

const CalendarListResponseSchema = z
	.object({
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: z.array(CalendarResponseSchema),
	})
	.passthrough();

const CalendarInputFields = {
	metadata: z.record(z.string(), z.string()).optional(),
	oauth_client_id: z.string().min(1).max(2000).optional(),
	oauth_client_secret: z.string().min(1).max(2000).nullable().optional(),
	oauth_client_certificate: z.string().min(1).max(8000).nullable().optional(),
	oauth_client_private_key: z.string().min(1).max(8000).nullable().optional(),
	oauth_refresh_token: z.string().min(1).max(10000).optional(),
	platform: platform.optional(),
	oauth_email: z.string().email().min(1).max(2000).optional(),
};

export const ListCalendarsInputSchema = z
	.object({
		created_at__gte: z.string().datetime().optional(),
		cursor: z.string().optional(),
		email: z.string().optional(),
		platform: platform.optional(),
		status: status.optional(),
	})
	.strict();

export const CreateCalendarInputSchema = z
	.object({
		...CalendarInputFields,
		oauth_client_id: z.string().min(1).max(2000),
		oauth_refresh_token: z.string().min(1).max(10000),
		platform,
	})
	.strict();

export const CalendarIdInputSchema = z.object({ id: calendarId }).strict();

export const UpdateCalendarInputSchema = z
	.object({ id: calendarId, ...CalendarInputFields })
	.strict();

export const CalendarAccessTokenResponseSchema = z.object({
	token: z.string(),
	expires_at: z.string().datetime(),
});

export const CalendarUndefinedResponseSchema = z.undefined();

export const listCalendars = async (
	ctx: RecallaiContext,
	input: z.input<typeof ListCalendarsInputSchema>,
) => {
	const query = ListCalendarsInputSchema.parse(input);
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		'/api/v2/calendars/',
		{
			method: 'GET',
			query,
			headers: { Authorization: `Token ${ctx.key}` },
		},
	);
	const result = CalendarListResponseSchema.parse(response);
	await logEventFromContext(ctx, 'recallai.calendars.list', {}, 'completed');
	return result;
};

export const createCalendar = async (
	ctx: RecallaiContext,
	input: z.input<typeof CreateCalendarInputSchema>,
) => {
	const body = CreateCalendarInputSchema.parse(input);
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		'/api/v2/calendars/',
		{
			method: 'POST',
			body,
			headers: { Authorization: `Token ${ctx.key}` },
		},
	);
	const result = CalendarResponseSchema.parse(response);
	await logEventFromContext(ctx, 'recallai.calendars.create', {}, 'completed');
	return result;
};

export const retrieveCalendar = async (
	ctx: RecallaiContext,
	input: z.input<typeof CalendarIdInputSchema>,
) => {
	const { id } = CalendarIdInputSchema.parse(input);
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		`/api/v2/calendars/${encodeURIComponent(id)}/`,
		{ method: 'GET', headers: { Authorization: `Token ${ctx.key}` } },
	);
	const result = CalendarResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'recallai.calendars.retrieve',
		{ id },
		'completed',
	);
	return result;
};

export const updateCalendar = async (
	ctx: RecallaiContext,
	input: z.input<typeof UpdateCalendarInputSchema>,
) => {
	const { id, ...body } = UpdateCalendarInputSchema.parse(input);
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		`/api/v2/calendars/${encodeURIComponent(id)}/`,
		{
			method: 'PATCH',
			body,
			headers: { Authorization: `Token ${ctx.key}` },
		},
	);
	const result = CalendarResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'recallai.calendars.update',
		{ id },
		'completed',
	);
	return result;
};

export const deleteCalendar = async (
	ctx: RecallaiContext,
	input: z.input<typeof CalendarIdInputSchema>,
) => {
	const { id } = CalendarIdInputSchema.parse(input);
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		`/api/v2/calendars/${encodeURIComponent(id)}/`,
		{
			method: 'DELETE',
			headers: { Authorization: `Token ${ctx.key}` },
		},
	);
	const result = CalendarUndefinedResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'recallai.calendars.delete',
		{ id },
		'completed',
	);
	return result;
};

export const createCalendarAccessToken = async (
	ctx: RecallaiContext,
	input: z.input<typeof CalendarIdInputSchema>,
) => {
	const { id } = CalendarIdInputSchema.parse(input);
	const response = await makeRecallaiContextRequest<RecallaiJsonValue>(
		ctx,
		`/api/v2/calendars/${encodeURIComponent(id)}/access-token/`,
		{
			method: 'POST',
			headers: { Authorization: `Token ${ctx.key}` },
		},
	);
	const result = CalendarAccessTokenResponseSchema.parse(response);
	await logEventFromContext(
		ctx,
		'recallai.calendars.createAccessToken',
		{ id },
		'completed',
	);
	return result;
};

export const calendarsSchemas = {
	list: { input: ListCalendarsInputSchema, output: CalendarListResponseSchema },
	create: { input: CreateCalendarInputSchema, output: CalendarResponseSchema },
	retrieve: { input: CalendarIdInputSchema, output: CalendarResponseSchema },
	update: { input: UpdateCalendarInputSchema, output: CalendarResponseSchema },
	delete: {
		input: CalendarIdInputSchema,
		output: CalendarUndefinedResponseSchema,
	},
	createAccessToken: {
		input: CalendarIdInputSchema,
		output: CalendarAccessTokenResponseSchema,
	},
} as const;
