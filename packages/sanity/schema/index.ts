import { sanityEntities } from './database';

export const SanitySchema = {
	version: '1.0.0',
	entities: sanityEntities,
} as const;
