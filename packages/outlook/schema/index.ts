import {
	OutlookCalendar,
	OutlookContact,
	OutlookEvent,
	OutlookMailFolder,
	OutlookMessage,
} from './database';

export const OutlookSchema = {
	version: '1.0.0',
	entities: {
		messages: OutlookMessage,
		events: OutlookEvent,
		calendars: OutlookCalendar,
		contacts: OutlookContact,
		folders: OutlookMailFolder,
	},
} as const;
