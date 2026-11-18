import { lexofficeEntities } from './database';

export const LexofficeSchema = {
	version: '1.0.0',
	entities: lexofficeEntities,
} as const;
