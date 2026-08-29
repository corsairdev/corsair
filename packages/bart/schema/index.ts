import { BartAdvisory, BartRoute, BartStation } from './database';

export const BartSchema = {
	version: '1.0.0',
	entities: {
		stations: BartStation,
		routes: BartRoute,
		advisories: BartAdvisory,
	},
} as const;

export * from './database';
