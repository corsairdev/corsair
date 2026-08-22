import { AeroleadsLinkedinDetails } from './database';

export const AeroleadsSchema = {
	version: '1.0.0',
	entities: {
		linkedinDetails: AeroleadsLinkedinDetails,
	},
} as const;

export * from './database';
