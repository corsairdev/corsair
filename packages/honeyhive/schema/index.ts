import { honeyHiveEntities } from './database';

export const HoneyHiveSchema = {
	version: '1.0.0',
	entities: honeyHiveEntities,
} as const;

export * from './database';
