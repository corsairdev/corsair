import { regionsOperations } from '../operations/regions';
import type { PrismaEndpoint } from './factory';
import {
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

function getOperation(name: (typeof regionsOperations)[number]['name']) {
	const operation = regionsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

const listRegionsDefinition = getOperation('list');
export const listRegions: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listRegionsDefinition,
	);
	await syncPrismaOperationResult(ctx, listRegionsDefinition, input, result);
	await logPrismaOperation(ctx, input, listRegionsDefinition);
	return result;
};

const listPostgresRegionsDefinition = getOperation('listPostgres');
export const listPostgresRegions: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listPostgresRegionsDefinition,
	);
	await syncPrismaOperationResult(
		ctx,
		listPostgresRegionsDefinition,
		input,
		result,
	);
	await logPrismaOperation(ctx, input, listPostgresRegionsDefinition);
	return result;
};

export const RegionsEndpoints = {
	list: listRegions,
	listPostgres: listPostgresRegions,
} as const;
