import { consumptionOperations } from '../operations/consumption';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof consumptionOperations)[number]['name']) {
	const operation = consumptionOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const getConsumptionHistoryPerProjectDefinition = getOperation(
	'getConsumptionHistoryPerProject',
);
export const getConsumptionHistoryPerProject: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getConsumptionHistoryPerProjectDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getConsumptionHistoryPerProjectDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getConsumptionHistoryPerProjectDefinition);
	return result;
};

const getConsumptionHistoryPerAccountDefinition = getOperation(
	'getConsumptionHistoryPerAccount',
);
export const getConsumptionHistoryPerAccount: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getConsumptionHistoryPerAccountDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getConsumptionHistoryPerAccountDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getConsumptionHistoryPerAccountDefinition);
	return result;
};

export const ConsumptionEndpoints = {
	getConsumptionHistoryPerProject,
	getConsumptionHistoryPerAccount,
} as const;
