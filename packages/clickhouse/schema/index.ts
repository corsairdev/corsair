import { ClickhouseQueryResult } from './database';

export const ClickhouseSchema = {
	version: '1.0.0',
	entities: {
		queryResult: ClickhouseQueryResult,
	},
} as const;

export type ClickhouseSchema = typeof ClickhouseSchema;
