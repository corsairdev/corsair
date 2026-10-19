import { Person } from './database';

export const PloidSchema = {
	version: '1.0.0',
	entities: {
		people: Person,
	},
	// as const: the version and entity name have to stay literal schema keys.
} as const;

export type { Person } from './database';
