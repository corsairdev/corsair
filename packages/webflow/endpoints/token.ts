import { tokenOperations } from '../operations/token';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof tokenOperations)[number]['name']) {
	const operation = tokenOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const getTokenAuthorizedByDefinition = getOperation('getTokenAuthorizedBy');
export const getTokenAuthorizedBy: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getTokenAuthorizedByDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getTokenAuthorizedByDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getTokenAuthorizedByDefinition);
	return result;
};

export const TokenEndpoints = {
	getTokenAuthorizedBy,
} as const;
