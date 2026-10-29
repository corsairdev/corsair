import { componentsOperations } from '../operations/components';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof componentsOperations)[number]['name']) {
	const operation = componentsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const getComponentPropertiesDefinition = getOperation('getComponentProperties');
export const getComponentProperties: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getComponentPropertiesDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getComponentPropertiesDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getComponentPropertiesDefinition);
	return result;
};

export const ComponentsEndpoints = {
	getComponentProperties,
} as const;
