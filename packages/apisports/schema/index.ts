import { ApiSportsQueryRecord } from './database';

export const ApiSportsSchema = {
	version: '1.0.0',
	entities: {
		queries: ApiSportsQueryRecord,
	},
} as const;
