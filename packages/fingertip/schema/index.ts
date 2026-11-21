import { fingertipEntities } from './database';

export const FingertipSchema = {
	version: '1.0.0',
	entities: fingertipEntities,
} as const;
