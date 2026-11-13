import { fomoEntities } from './database';

export const FomoSchema = {
	version: '1.0.0',
	entities: fomoEntities,
} as const;
