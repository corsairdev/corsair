import { langbaseEntities } from './database';

export const LangbaseSchema = {
	version: '1.0.0',
	entities: langbaseEntities,
} as const;
