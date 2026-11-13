import { eventeeEntities } from './database';

export const EventeeSchema = {
	version: '1.0.0',
	entities: eventeeEntities,
} as const;
