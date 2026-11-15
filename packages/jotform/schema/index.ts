import { jotformEntities } from './database';

export const JotformSchema = {
	version: '1.0.0',
	entities: jotformEntities,
} as const;
