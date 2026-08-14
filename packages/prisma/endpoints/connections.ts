import { connectionsOperations } from '../operations/connections';
import type { PrismaEndpoint } from './factory';
import {
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

function getOperation(name: (typeof connectionsOperations)[number]['name']) {
	const operation = connectionsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

const createConnectionDefinition = getOperation('create');
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

const listConnectionsDefinition = getOperation('list');
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

const deleteConnectionDefinition = getOperation('delete');
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
