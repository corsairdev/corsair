import { jobNimbusEntities } from './database';

export const JobNimbusSchema = {
	version: '1.0.0',
	entities: jobNimbusEntities,
} as const;
