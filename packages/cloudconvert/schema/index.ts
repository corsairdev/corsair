import { cloudConvertEntities } from './database';

export const CloudConvertSchema = {
	version: '1.0.0',
	entities: cloudConvertEntities,
} as const;
