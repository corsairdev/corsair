import { fathomEntities } from './database';

export const FathomSchema = {
	version: '1.0.0',
	entities: fathomEntities,
} as const;
