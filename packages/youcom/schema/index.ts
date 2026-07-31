import { YoucomSearchResult } from './database';

export const YoucomSchema = {
	version: '1.0.0',
	entities: {
		searchResults: YoucomSearchResult,
	},
} as const;
