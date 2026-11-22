import { lemlistEntities } from './database';

export const LemlistSchema = {
	version: '1.0.0',
	entities: lemlistEntities,
} as const;
