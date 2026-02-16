import { z } from 'zod';
import type { Event, EventListResponse, FreeBusyResponse } from '../types';

const EventsCreateInputSchema = z.object({
	calendarId: z.string().optional(),
	event: z.record(z.unknown()),
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
	calendarId: z.string().optional(),
	id: z.string(),
	event: z.record(z.unknown()),
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

const EventDateTimeSchema = z.object({
	date: z.string().optional(),
	dateTime: z.string().optional(),
	timeZone: z.string().optional(),
});

const AttendeeSchema = z.object({
	id: z.string().optional(),
	email: z.string().optional(),
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
	useDefault: z.boolean().optional(),
	overrides: z.array(ReminderSchema).optional(),
});

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
