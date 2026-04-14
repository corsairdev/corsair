import { TavilyCrawlResult, TavilyExtractResult, TavilyMapResult, TavilySearchResult } from './database';

export const TavilySchema = {
	version: '1.0.0',
	entities: {
		searchResults: TavilySearchResult,
		extractResults: TavilyExtractResult,
		crawlResults: TavilyCrawlResult,
		mapResults: TavilyMapResult,
	},
} as const;
