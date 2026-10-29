import {
	ChMeetingsEvent,
	ChMeetingsOrganization,
	ChMeetingsPerson,
} from './database';

export const ChMeetingsSchema = {
	version: '1.0.0',
	entities: {
		people: ChMeetingsPerson,
		organizations: ChMeetingsOrganization,
		events: ChMeetingsEvent,
	},
} as const;
