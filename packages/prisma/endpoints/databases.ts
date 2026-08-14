import { databasesOperations } from '../operations/databases';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';
import { inspectDatabaseSchema } from './sql';

const createDatabaseDefinition = findOperation(databasesOperations, 'create');
export const createDatabase: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		createDatabaseDefinition,
	);
	await syncPrismaOperationResult(ctx, createDatabaseDefinition, input, result);
	await logPrismaOperation(ctx, input, createDatabaseDefinition);
	return result;
};

const getDatabaseDefinition = findOperation(databasesOperations, 'get');
export const getDatabase: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		getDatabaseDefinition,
	);
	await syncPrismaOperationResult(ctx, getDatabaseDefinition, input, result);
	await logPrismaOperation(ctx, input, getDatabaseDefinition);
	return result;
};

const listDatabasesDefinition = findOperation(databasesOperations, 'list');
export const listDatabases: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listDatabasesDefinition,
	);
	await syncPrismaOperationResult(ctx, listDatabasesDefinition, input, result);
	await logPrismaOperation(ctx, input, listDatabasesDefinition);
	return result;
};

const deleteDatabaseDefinition = findOperation(databasesOperations, 'delete');
export const deleteDatabase: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		deleteDatabaseDefinition,
	);
	await syncPrismaOperationResult(ctx, deleteDatabaseDefinition, input, result);
	await logPrismaOperation(ctx, input, deleteDatabaseDefinition);
	return result;
};

const getDatabaseUsageDefinition = findOperation(
	databasesOperations,
	'getUsage',
);
export const getDatabaseUsage: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		getDatabaseUsageDefinition,
	);
	await logPrismaOperation(ctx, input, getDatabaseUsageDefinition);
	return result;
};

export const DatabasesEndpoints = {
	create: createDatabase,
	get: getDatabase,
	list: listDatabases,
	delete: deleteDatabase,
	getUsage: getDatabaseUsage,
	inspectSchema: inspectDatabaseSchema,
} as const;
