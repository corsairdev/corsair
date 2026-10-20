import { hunterioEntities } from './database';

export const HunterioSchema = {
	version: '1.0.0',
	entities: hunterioEntities,
} as const;
