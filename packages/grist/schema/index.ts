import { gristEntities } from './database';

export const GristSchema = {
	version: '1.0.0',
	entities: gristEntities,
} as const;
