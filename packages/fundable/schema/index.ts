import { fundableEntities } from './database';

export const FundableSchema = {
	version: '1.0.0',
	entities: fundableEntities,
} as const;
