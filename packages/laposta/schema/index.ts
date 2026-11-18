import { lapostaEntities } from './database';

export const LapostaSchema = {
	version: '1.0.0',
	entities: lapostaEntities,
} as const;
