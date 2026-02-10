import { z } from 'zod';

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

export const GoogleCalendarEvent = z.object({
	id: z.string(),
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
	visibility: z.enum(['default', 'public', 'private', 'confidential']).optional(),
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
	eventType: z.enum(['default', 'outOfOffice', 'focusTime', 'workingLocation']).optional(),
	calendarId: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GoogleCalendar = z.object({
	id: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	timeZone: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export type GoogleCalendarEvent = z.infer<typeof GoogleCalendarEvent>;
export type GoogleCalendar = z.infer<typeof GoogleCalendar>;
