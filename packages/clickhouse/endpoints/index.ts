import { execute as executeQuery } from './execute-query';
import { getDatabaseSchema } from './get-database-schema';
import { getTableSchema } from './get-table-schema';
import { listDatabases } from './list-databases';
import { listTables } from './list-tables';
import { getPlayInterface } from './play';

export const Query = {
	execute: executeQuery,
	listDatabases,
	listTables,
};

export const Schema = {
	getDatabase: getDatabaseSchema,
	getTable: getTableSchema,
};

export const Play = {
	get: getPlayInterface,
};

export * from './types';
