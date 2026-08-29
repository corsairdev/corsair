import {
	ClickhouseColumn,
	ClickhouseDatabase,
	ClickhouseQueryResult,
	ClickhouseTable,
} from './database';

export const ClickhouseSchema = {
	version: '1.0.0',
	entities: {
		database: ClickhouseDatabase,
		table: ClickhouseTable,
		column: ClickhouseColumn,
		queryResult: ClickhouseQueryResult,
	},
} as const;

export type ClickhouseSchema = typeof ClickhouseSchema;

export {
	ClickhouseColumn,
	ClickhouseDatabase,
	ClickhouseQueryResult,
	ClickhouseTable,
} from './database';
