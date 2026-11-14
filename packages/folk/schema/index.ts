import { folkEntities } from './database';

export const FolkSchema = {
	version: '1.0.0',
	entities: folkEntities,
} as const;
