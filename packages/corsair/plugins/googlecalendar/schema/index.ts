import { GoogleCalendar, GoogleCalendarEvent } from './database';

export const GoogleCalendarSchema = {
	version: '1.0.0',
	entities: {
		events: GoogleCalendarEvent,
		calendars: GoogleCalendar,
	},
} as const;
