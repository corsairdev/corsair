import { lodgifyEntities } from './database';

export const LodgifySchema = {
	version: '1.0.0',
	entities: lodgifyEntities,
} as const;
