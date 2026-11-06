import { veoEntities } from './database';

export const VeoSchema = {
	version: '1.0.0',
	entities: veoEntities,
} as const;
