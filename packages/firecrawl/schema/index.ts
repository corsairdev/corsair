import {
	FirecrawlJob,
	FirecrawlScrape,
	FirecrawlSearchRecord,
	FirecrawlSiteMap,
} from './database';

export const FirecrawlSchema = {
	version: '2.0.0',
	entities: {
		scrapes: FirecrawlScrape,
		jobs: FirecrawlJob,
		siteMaps: FirecrawlSiteMap,
		searches: FirecrawlSearchRecord,
	},
} as const;
