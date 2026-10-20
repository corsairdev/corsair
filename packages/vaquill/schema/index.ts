import { VaquillSearchResult } from './database';

export const VaquillSchema = {
	version: '1.0.0',
	entities: {
		searchResults: VaquillSearchResult,
	},
} as const;
