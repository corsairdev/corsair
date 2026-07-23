import { regionsOperations } from '../operations/regions';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof regionsOperations)[number]['name']) {
	const operation = regionsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const getActiveRegionsDefinition = getOperation('getActiveRegions');
export const getActiveRegions: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getActiveRegionsDefinition,
	);
	await syncNeonOperationResult(ctx, getActiveRegionsDefinition, input, result);
	await logNeonOperation(ctx, input, getActiveRegionsDefinition);
	return result;
};

export const RegionsEndpoints = {
	getActiveRegions,
} as const;
