import { octenEntities } from './database';

export const OctenSchema = {
	version: '1.0.0',
	entities: octenEntities,
} as const;
