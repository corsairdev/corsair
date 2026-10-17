import { Person } from './database';

export const PloidSchema = {
	version: '1.0.0',
	entities: {
		people: Person,
	},
} as const;

export type { Person } from './database';
