import { z } from 'zod';
import type { RecallaiJsonObject } from '../json';
import { RecallaiJsonObjectSchema } from '../json';

const id = z.string().uuid();
const opaque = RecallaiJsonObjectSchema;
// Recall calendar responses include provider-specific fields, so preserve the
// response payload while still requiring a JSON object or list of objects.
const objectResponse = RecallaiJsonObjectSchema;
const arrayResponse = z.array(opaque);

export const CalendarAuthenticateInputSchema = z.object({
	user_id: z.string().min(1),
});
const calendarAuth = z.string().min(1);
export const CalendarMeetingsListInputSchema = z.object({
	calendar_auth_token: calendarAuth,
	ical_uid: z.string().optional(),
	start_time_after: z.string().datetime().optional(),
	start_time_before: z.string().datetime().optional(),
});
export const CalendarMeetingInputSchema = z.object({
	id,
	calendar_auth_token: calendarAuth,
});
export const CalendarMeetingUpdateInputSchema = z.object({
	id,
	calendar_auth_token: calendarAuth,
	override_should_record: z.boolean().optional(),
});
export const CalendarUserUpdateInputSchema = z.object({
	calendar_auth_token: calendarAuth,
	external_id: z.string().optional(),
	preferences: opaque.optional(),
});
export const CalendarDisconnectInputSchema = z.object({
	calendar_auth_token: calendarAuth,
	platform: z.enum(['google', 'microsoft']),
});
export const CalendarUserAuthInputSchema = z.object({
	calendar_auth_token: calendarAuth,
});
// Without `paginate` Recall returns every user as a bare array. With it, the
// answer is a page ({ count, next, previous, results }) and `page` picks
// which one; `next` is the URL of the following page.
export const CalendarUsersListInputSchema = z
	.object({
		email: z.string().email().optional(),
		paginate: z.boolean().optional(),
		page: z.number().int().positive().optional(),
	})
	.refine(({ page, paginate }) => page === undefined || paginate === true, {
		message: 'page only applies with paginate: true',
	});
export const CalendarEventsListInputSchema = z.object({
	calendar_id: id,
	cursor: z.string().optional(),
	ical_uid: z.string().optional(),
	is_deleted: z.boolean().optional(),
	start_time: z.string().datetime().optional(),
	start_time__gte: z.string().datetime().optional(),
	start_time__lte: z.string().datetime().optional(),
	updated_at__gte: z.string().datetime().optional(),
});
export const CalendarEventInputSchema = z.object({ id });
export const CalendarEventBotInputSchema = z.object({
	id,
	deduplication_key: z.string().min(1),
	bot_config: opaque,
});

// Recall documents calendar and SDK payloads as provider-specific objects. The
// known input envelope is validated while documented response objects remain
// extensible for provider-specific calendar fields.
export const CalendarObjectResponseSchema = objectResponse;
export const CalendarArrayResponseSchema = arrayResponse;
export const CalendarUsersResponseSchema = z.union([
	arrayResponse,
	z.object({
		count: z.number().int().nonnegative().optional(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		results: arrayResponse,
	}),
]);
export const CalendarUndefinedResponseSchema = z.undefined();

export type CalendarEndpointInputs = {
	authenticateCalendar: z.infer<typeof CalendarAuthenticateInputSchema>;
	listCalendarMeetings: z.infer<typeof CalendarMeetingsListInputSchema>;
	retrieveCalendarMeeting: z.infer<typeof CalendarMeetingInputSchema>;
	updateCalendarMeeting: z.infer<typeof CalendarMeetingUpdateInputSchema>;
	refreshCalendarMeetings: z.infer<typeof CalendarUserAuthInputSchema>;
	retrieveCalendarUser: z.infer<typeof CalendarUserAuthInputSchema>;
	updateCalendarUser: z.infer<typeof CalendarUserUpdateInputSchema>;
	deleteCalendarUser: z.infer<typeof CalendarUserAuthInputSchema>;
	disconnectCalendarPlatform: z.infer<typeof CalendarDisconnectInputSchema>;
	listCalendarUsers: z.infer<typeof CalendarUsersListInputSchema>;
	listCalendarEvents: z.infer<typeof CalendarEventsListInputSchema>;
	retrieveCalendarEvent: z.infer<typeof CalendarEventInputSchema>;
	scheduleBotForCalendarEvent: z.infer<typeof CalendarEventBotInputSchema>;
	unscheduleBotForCalendarEvent: z.infer<typeof CalendarEventInputSchema>;
};

export type CalendarEndpointOutputs = {
	authenticateCalendar: RecallaiJsonObject;
	listCalendarMeetings: RecallaiJsonObject[];
	retrieveCalendarMeeting: RecallaiJsonObject;
	updateCalendarMeeting: RecallaiJsonObject;
	refreshCalendarMeetings: RecallaiJsonObject[];
	retrieveCalendarUser: RecallaiJsonObject;
	updateCalendarUser: RecallaiJsonObject;
	deleteCalendarUser: undefined;
	disconnectCalendarPlatform: RecallaiJsonObject;
	listCalendarUsers:
		| RecallaiJsonObject[]
		| {
				count?: number;
				next?: string | null;
				previous?: string | null;
				results: RecallaiJsonObject[];
		  };
	listCalendarEvents: RecallaiJsonObject;
	retrieveCalendarEvent: RecallaiJsonObject;
	scheduleBotForCalendarEvent: RecallaiJsonObject;
	unscheduleBotForCalendarEvent: RecallaiJsonObject;
};
