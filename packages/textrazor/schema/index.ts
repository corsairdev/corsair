import {
	TextrazorAccount,
	TextrazorCategory,
	TextrazorDictionary,
	TextrazorDictionaryEntry,
	TextrazorEntity,
} from './database';

export const TextrazorSchema = {
	version: '1.0.0',
	entities: {
		accounts: TextrazorAccount,
		dictionaries: TextrazorDictionary,
		dictionaryEntries: TextrazorDictionaryEntry,
		categories: TextrazorCategory,
		entities: TextrazorEntity,
	},
} as const;

export type {
	TextrazorAccount,
	TextrazorCategory,
	TextrazorDictionary,
	TextrazorDictionaryEntry,
	TextrazorEntity,
} from './database';
