import { PagerdutyIncident } from './database';

export const PagerdutySchema = {
	version: '1.0.0',
	entities: {
		incidents: PagerdutyIncident,
	},
} as const;
