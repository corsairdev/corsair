import { interzoidEntities } from './database';

export const InterzoidSchema = {
	version: '1.0.0',
	entities: interzoidEntities,
} as const;
