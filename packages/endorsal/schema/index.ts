import { endorsalEntities } from './database';

export const EndorsalSchema = {
	version: '1.0.0',
	entities: endorsalEntities,
} as const;
