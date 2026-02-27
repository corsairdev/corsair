import { z } from 'zod';
import type { Event, EventListResponse, FreeBusyResponse } from '../types';

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

const EventDateTimeSchema = z.object({
	date: z
		.string()
		.optional()
		.describe('All-day event date in "YYYY-MM-DD" format'),
	dateTime: z
		.string()
		.optional()
		.describe(
			'RFC 3339 timestamp, e.g. "2024-12-25T10:00:00-07:00". Required for timed events.',
		),
	timeZone: z
		.string()
		.optional()
		.describe('IANA time zone name, e.g. "America/New_York"'),
});

const AttendeeSchema = z.object({
	id: z.string().optional(),
	email: z
		.string()
		.optional()
		.describe("Attendee's email address. Required when adding an attendee."),
	displayName: z.string().optional(),
	organizer: z.boolean().optional(),
	self: z.boolean().optional(),
	resource: z.boolean().optional(),
	optional: z.boolean().optional(),
	responseStatus: z
		.enum(['needsAction', 'declined', 'tentative', 'accepted'])
		.optional(),
	comment: z.string().optional(),
	additionalGuests: z.number().optional(),
});

const OrganizerSchema = z.object({
	id: z.string().optional(),
	email: z.string().optional(),
	displayName: z.string().optional(),
	self: z.boolean().optional(),
});

const ReminderSchema = z.object({
	method: z.enum(['email', 'popup']).optional(),
	minutes: z.number().optional(),
});

const EventRemindersSchema = z.object({
	useDefault: z
		.boolean()
		.optional()
		.describe('Use the calendar default reminders'),
	overrides: z
		.array(ReminderSchema)
		.optional()
		.describe('Custom reminders. Only used when useDefault is false.'),
});

// Writable event fields used for create / update requests
const EventInputSchema = z.object({
	summary: z.string().optional().describe('Title of the event'),
	description: z
		.string()
		.optional()
		.describe('Description of the event. HTML is supported.'),
	location: z
		.string()
		.optional()
		.describe('Geographic location of the event as free-form text'),
	start: EventDateTimeSchema.optional().describe(
		'Start time. Use "date" for all-day events, "dateTime" for timed events.',
	),
	end: EventDateTimeSchema.optional().describe(
		'End time. Use "date" for all-day events, "dateTime" for timed events.',
	),
	attendees: z
		.array(AttendeeSchema)
		.optional()
		.describe('List of attendees. Each attendee must include an email.'),
	recurrence: z
		.array(z.string())
		.optional()
		.describe(
			'RRULE / EXDATE lines per RFC 5545, e.g. ["RRULE:FREQ=WEEKLY;COUNT=5"]',
		),
	colorId: z
		.string()
		.optional()
		.describe('Color ID (1–11). Use the colors endpoint to see options.'),
	transparency: z
		.enum(['opaque', 'transparent'])
		.optional()
		.describe(
			'"opaque" blocks time on the calendar (default); "transparent" does not',
		),
	visibility: z
		.enum(['default', 'public', 'private', 'confidential'])
		.optional(),
	eventType: z
		.enum(['default', 'outOfOffice', 'focusTime', 'workingLocation'])
		.optional(),
	status: z.enum(['confirmed', 'tentative', 'cancelled']).optional(),
	reminders: EventRemindersSchema.optional(),
	guestsCanModify: z.boolean().optional(),
	guestsCanInviteOthers: z.boolean().optional(),
	guestsCanSeeOtherGuests: z.boolean().optional(),
	anyoneCanAddSelf: z.boolean().optional(),
	sequence: z
		.number()
		.optional()
		.describe('Sequence number for recurring event updates'),
	originalStartTime: EventDateTimeSchema.optional().describe(
		'Original start time for a recurring event instance',
	),
	recurringEventId: z
		.string()
		.optional()
		.describe('ID of the recurring event this instance belongs to'),
});

// ─── Input schemas ────────────────────────────────────────────────────────────

const EventsCreateInputSchema = z.object({
	calendarId: z
		.string()
		.optional()
		.describe('Calendar ID. Defaults to "primary".'),
	event: EventInputSchema.describe(
		'Event body. Provide at minimum "summary", "start", and "end".',
	),
	sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
	sendNotifications: z.boolean().optional(),
	conferenceDataVersion: z.number().optional(),
	maxAttendees: z.number().optional(),
	supportsAttachments: z.boolean().optional(),
});

const EventsGetInputSchema = z.object({
	calendarId: z.string().optional(),
	id: z.string(),
	timeZone: z.string().optional(),
	maxAttendees: z.number().optional(),
});

const EventsGetManyInputSchema = z.object({
	calendarId: z.string().optional(),
	timeMin: z.string().optional(),
	timeMax: z.string().optional(),
	timeZone: z.string().optional(),
	updatedMin: z.string().optional(),
	singleEvents: z.boolean().optional(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	q: z.string().optional(),
	orderBy: z.enum(['startTime', 'updated']).optional(),
	iCalUID: z.string().optional(),
	showDeleted: z.boolean().optional(),
	showHiddenInvitations: z.boolean().optional(),
});

const EventsUpdateInputSchema = z.object({
	calendarId: z
		.string()
		.optional()
		.describe('Calendar ID. Defaults to "primary".'),
	id: z.string().describe('Event ID to update'),
	event: EventInputSchema.describe('Updated event fields'),
	sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
	sendNotifications: z.boolean().optional(),
	conferenceDataVersion: z.number().optional(),
	maxAttendees: z.number().optional(),
	supportsAttachments: z.boolean().optional(),
});

const EventsDeleteInputSchema = z.object({
	calendarId: z.string().optional(),
	id: z.string(),
	sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
	sendNotifications: z.boolean().optional(),
});

const CalendarGetAvailabilityInputSchema = z.object({
	timeMin: z.string(),
	timeMax: z.string(),
	timeZone: z.string().optional(),
	groupExpansionMax: z.number().optional(),
	calendarExpansionMax: z.number().optional(),
	items: z
		.array(
			z.object({
				id: z.string(),
			}),
		)
		.optional(),
});

export const GoogleCalendarEndpointInputSchemas = {
	eventsCreate: EventsCreateInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsGetMany: EventsGetManyInputSchema,
	eventsUpdate: EventsUpdateInputSchema,
	eventsDelete: EventsDeleteInputSchema,
	calendarGetAvailability: CalendarGetAvailabilityInputSchema,
} as const;

export type GoogleCalendarEndpointInputs = {
	[K in keyof typeof GoogleCalendarEndpointInputSchemas]: z.infer<
		(typeof GoogleCalendarEndpointInputSchemas)[K]
	>;
};

// ─── Output schemas ───────────────────────────────────────────────────────────

const EventSchema = z.object({
	id: z.string().optional(),
	status: z.enum(['confirmed', 'tentative', 'cancelled']).optional(),
	htmlLink: z.string().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	summary: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	colorId: z.string().optional(),
	creator: OrganizerSchema.optional(),
	organizer: OrganizerSchema.optional(),
	start: EventDateTimeSchema.optional(),
	end: EventDateTimeSchema.optional(),
	endTimeUnspecified: z.boolean().optional(),
	recurrence: z.array(z.string()).optional(),
	recurringEventId: z.string().optional(),
	originalStartTime: EventDateTimeSchema.optional(),
	transparency: z.enum(['opaque', 'transparent']).optional(),
	visibility: z
		.enum(['default', 'public', 'private', 'confidential'])
		.optional(),
	iCalUID: z.string().optional(),
	sequence: z.number().optional(),
	attendees: z.array(AttendeeSchema).optional(),
	attendeesOmitted: z.boolean().optional(),
	hangoutLink: z.string().optional(),
	reminders: EventRemindersSchema.optional(),
	anyoneCanAddSelf: z.boolean().optional(),
	guestsCanInviteOthers: z.boolean().optional(),
	guestsCanModify: z.boolean().optional(),
	guestsCanSeeOtherGuests: z.boolean().optional(),
	privateCopy: z.boolean().optional(),
	locked: z.boolean().optional(),
	eventType: z
		.enum(['default', 'outOfOffice', 'focusTime', 'workingLocation'])
		.optional(),
});

const EventListResponseSchema = z.object({
	kind: z.string().optional(),
	etag: z.string().optional(),
	summary: z.string().optional(),
	description: z.string().optional(),
	updated: z.string().optional(),
	timeZone: z.string().optional(),
	accessRole: z.string().optional(),
	defaultReminders: z.array(ReminderSchema).optional(),
	nextPageToken: z.string().optional(),
	nextSyncToken: z.string().optional(),
	items: z.array(EventSchema).optional(),
});

const FreeBusyCalendarSchema = z.object({
	busy: z
		.array(
			z.object({
				start: z.string().optional(),
				end: z.string().optional(),
			}),
		)
		.optional(),
	errors: z
		.array(
			z.object({
				domain: z.string().optional(),
				reason: z.string().optional(),
			}),
		)
		.optional(),
});

const FreeBusyResponseSchema = z.object({
	kind: z.string().optional(),
	calendars: z.record(z.string(), FreeBusyCalendarSchema).optional(),
	groups: z
		.record(
			z.string(),
			z.object({
				calendars: z.array(z.string()).optional(),
				errors: z
					.array(
						z.object({
							domain: z.string().optional(),
							reason: z.string().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	timeMin: z.string().optional(),
	timeMax: z.string().optional(),
});

export const GoogleCalendarEndpointOutputSchemas = {
	eventsCreate: EventSchema,
	eventsGet: EventSchema,
	eventsGetMany: EventListResponseSchema,
	eventsUpdate: EventSchema,
	eventsDelete: z.void(),
	calendarGetAvailability: FreeBusyResponseSchema,
} as const;

export type GoogleCalendarEndpointOutputs = {
	eventsCreate: Event;
	eventsGet: Event;
	eventsGetMany: EventListResponse;
	eventsUpdate: Event;
	eventsDelete: void;
	calendarGetAvailability: FreeBusyResponse;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schema Map — dot-path → {{ input, output }} for get_schema()
// ─────────────────────────────────────────────────────────────────────────────
export const googlecalendarEndpointSchemas = {
	'events.create': {
		input: GoogleCalendarEndpointInputSchemas.eventsCreate,
		output: GoogleCalendarEndpointOutputSchemas.eventsCreate,
	},
	'events.get': {
		input: GoogleCalendarEndpointInputSchemas.eventsGet,
		output: GoogleCalendarEndpointOutputSchemas.eventsGet,
	},
	'events.getMany': {
		input: GoogleCalendarEndpointInputSchemas.eventsGetMany,
		output: GoogleCalendarEndpointOutputSchemas.eventsGetMany,
	},
	'events.update': {
		input: GoogleCalendarEndpointInputSchemas.eventsUpdate,
		output: GoogleCalendarEndpointOutputSchemas.eventsUpdate,
	},
	'events.delete': {
		input: GoogleCalendarEndpointInputSchemas.eventsDelete,
		output: GoogleCalendarEndpointOutputSchemas.eventsDelete,
	},
	'calendar.getAvailability': {
		input: GoogleCalendarEndpointInputSchemas.calendarGetAvailability,
		output: GoogleCalendarEndpointOutputSchemas.calendarGetAvailability,
	},
} as const;
