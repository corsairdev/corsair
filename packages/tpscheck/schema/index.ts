import { tpscheckEntities } from './database';

export const TpscheckSchema = {
	version: '1.0.0',
	entities: tpscheckEntities,
} as const;
