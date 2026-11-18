import { Search1APISearchResult } from './database';

export const Search1APISchema = {
	version: '1.0.0',
	entities: {
		searchResults: Search1APISearchResult,
	},
} as const;
