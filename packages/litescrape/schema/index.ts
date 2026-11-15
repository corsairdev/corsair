import { litescrapeEntities } from './database';

export const LitescrapeSchema = {
	version: '1.0.0',
	entities: litescrapeEntities,
} as const;
