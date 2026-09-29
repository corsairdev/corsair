import { connectionsOperations } from '../operations/connections';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

const createConnectionDefinition = findOperation(
	connectionsOperations,
	'create',
);
export const createConnection: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		createConnectionDefinition,
	);
	await syncPrismaOperationResult(
		ctx,
		createConnectionDefinition,
		input,
		result,
	);
	await logPrismaOperation(ctx, input, createConnectionDefinition);
	return result;
};

const listConnectionsDefinition = findOperation(connectionsOperations, 'list');
export const listConnections: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listConnectionsDefinition,
	);
	await syncPrismaOperationResult(
		ctx,
		listConnectionsDefinition,
		input,
		result,
	);
	await logPrismaOperation(ctx, input, listConnectionsDefinition);
	return result;
};

const deleteConnectionDefinition = findOperation(
	connectionsOperations,
	'delete',
);
export const deleteConnection: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		deleteConnectionDefinition,
	);
	await syncPrismaOperationResult(
		ctx,
		deleteConnectionDefinition,
		input,
		result,
	);
	await logPrismaOperation(ctx, input, deleteConnectionDefinition);
	return result;
};

export const ConnectionsEndpoints = {
	create: createConnection,
	list: listConnections,
	delete: deleteConnection,
} as const;
