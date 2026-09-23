import { WriterEntities } from './database';

export const WriterSchema = {
	version: '1.0.0',
	entities: WriterEntities.shape,
} as const;

export * from './database';
