import { handwryttenEntities } from './database';

export const HandwryttenSchema = {
	version: '1.0.0',
	entities: handwryttenEntities,
} as const;
