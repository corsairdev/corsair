import { keenableEntities } from './database';

export const KeenableSchema = {
	version: '1.0.0',
	entities: keenableEntities,
} as const;
