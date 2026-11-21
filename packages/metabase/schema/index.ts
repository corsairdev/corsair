import { metabaseEntities } from './database';

export const MetabaseSchema = {
	version: '1.0.0',
	entities: metabaseEntities,
} as const;
