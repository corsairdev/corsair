import { gleapEntities } from './database';

export const GleapSchema = {
	version: '1.0.0',
	entities: gleapEntities,
} as const;
