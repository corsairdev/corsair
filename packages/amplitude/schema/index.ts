import { AmplitudeCohort, AmplitudeEvent, AmplitudeUser } from './database';

export const AmplitudeSchema = {
	version: '1.0.0',
	entities: {
		events: AmplitudeEvent,
		users: AmplitudeUser,
		cohorts: AmplitudeCohort,
	},
} as const;
