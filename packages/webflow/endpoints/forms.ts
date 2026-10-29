import { formsOperations } from '../operations/forms';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof formsOperations)[number]['name']) {
	const operation = formsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listFormSubmissionsDefinition = getOperation('listFormSubmissions');
export const listFormSubmissions: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listFormSubmissionsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		listFormSubmissionsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, listFormSubmissionsDefinition);
	return result;
};

export const FormsEndpoints = {
	listFormSubmissions,
} as const;
