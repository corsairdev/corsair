import { listennotesEntities } from './database';

export const ListennotesSchema = {
	version: '1.0.0',
	entities: listennotesEntities,
} as const;
