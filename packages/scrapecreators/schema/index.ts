import { scrapeCreatorsEntities } from './database';

export const ScrapeCreatorsSchema = {
	version: '1.0.0',
	entities: scrapeCreatorsEntities,
} as const;
