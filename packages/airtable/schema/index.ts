import { AirtableBase, AirtableRecord } from './database';

export const AirtableSchema = {
	version: '1.0.0',
	entities: {
		records: AirtableRecord,
		bases: AirtableBase,
	},
} as const;
