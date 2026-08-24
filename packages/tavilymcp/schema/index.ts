import {
	TavilyMcpCrawlResult,
	TavilyMcpExtractResult,
	TavilyMcpMapResult,
	TavilyMcpResearchResult,
	TavilyMcpSearchResult,
} from './database';

export const TavilyMcpSchema = {
	version: '1.0.0',
	entities: {
		searchResults: TavilyMcpSearchResult,
		extractResults: TavilyMcpExtractResult,
		crawlResults: TavilyMcpCrawlResult,
		mapResults: TavilyMcpMapResult,
		researchResults: TavilyMcpResearchResult,
	},
} as const;
