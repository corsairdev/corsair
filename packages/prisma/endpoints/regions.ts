import { regionsOperations } from '../operations/regions';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

const listRegionsDefinition = findOperation(regionsOperations, 'list');
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

const listPostgresRegionsDefinition = findOperation(
	regionsOperations,
	'listPostgres',
);
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
