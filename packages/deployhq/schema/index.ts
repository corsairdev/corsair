import { deployHQEntities } from './database';

export const DeployHQSchema = {
	version: '1.0.0',
	entities: deployHQEntities,
} as const;
