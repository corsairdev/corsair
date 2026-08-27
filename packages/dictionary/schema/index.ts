import { DictionaryEntryEntity } from './database';

export const DictionarySchema = {
	version: '1.0.0',
	entities: {
		entries: DictionaryEntryEntity,
	},
} as const;

export type { DictionaryEntryEntity } from './database';
