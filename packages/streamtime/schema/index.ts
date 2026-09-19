import { streamtimeEntities } from './database';

export const StreamtimeSchema = {
	version: '1.0.0',
	entities: streamtimeEntities,
} as const;
