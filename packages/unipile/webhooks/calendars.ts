import { defineUnipileWebhook } from './define';
import {
	CalendarCreateEventSchema,
	CalendarDeleteEventSchema,
	CalendarEventDeleteEventSchema,
	CalendarEventNewEventSchema,
	CalendarEventUpdateEventSchema,
	CalendarUpdateEventSchema,
} from './types';

export const calendarCreate = defineUnipileWebhook(
	'calendarCreate',
	'calendar.create',
	CalendarCreateEventSchema,
);

export const calendarUpdate = defineUnipileWebhook(
	'calendarUpdate',
	'calendar.update',
	CalendarUpdateEventSchema,
);

export const calendarDelete = defineUnipileWebhook(
	'calendarDelete',
	'calendar.delete',
	CalendarDeleteEventSchema,
);

// An event was created or the account was invited. Google and Outlook can report it up to 60 seconds late.
export const calendarEventNew = defineUnipileWebhook(
	'calendarEventNew',
	'calendar.event.new',
	CalendarEventNewEventSchema,
);

export const calendarEventUpdate = defineUnipileWebhook(
	'calendarEventUpdate',
	'calendar.event.update',
	CalendarEventUpdateEventSchema,
);

export const calendarEventDelete = defineUnipileWebhook(
	'calendarEventDelete',
	'calendar.event.delete',
	CalendarEventDeleteEventSchema,
);
