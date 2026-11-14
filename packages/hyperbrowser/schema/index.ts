import { hyperbrowserEntities } from './database';

export const HyperbrowserSchema = {
	version: '1.0.0',
	entities: hyperbrowserEntities,
} as const;
