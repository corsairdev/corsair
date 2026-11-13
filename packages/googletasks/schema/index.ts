import { googleTasksEntities } from './database';

export const GoogleTasksSchema = {
	version: '1.0.0',
	entities: googleTasksEntities,
} as const;
