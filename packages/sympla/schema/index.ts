import { SymplaEventEntity } from './database';

export const SymplaSchema = {
	version: '1.0.0',
	entities: {
		events: SymplaEventEntity,
	},
} as const;
