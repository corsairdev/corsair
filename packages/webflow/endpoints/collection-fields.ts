import { collectionFieldsOperations } from '../operations/collection-fields';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(
	name: (typeof collectionFieldsOperations)[number]['name'],
) {
	const operation = collectionFieldsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const createCollectionFieldDefinition = getOperation('createCollectionField');
export const createCollectionField: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		createCollectionFieldDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		createCollectionFieldDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, createCollectionFieldDefinition);
	return result;
};

const updateCollectionFieldDefinition = getOperation('updateCollectionField');
export const updateCollectionField: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateCollectionFieldDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updateCollectionFieldDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updateCollectionFieldDefinition);
	return result;
};

const deleteCollectionFieldDefinition = getOperation('deleteCollectionField');
export const deleteCollectionField: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		deleteCollectionFieldDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		deleteCollectionFieldDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, deleteCollectionFieldDefinition);
	return result;
};

export const CollectionFieldsEndpoints = {
	createCollectionField,
	updateCollectionField,
	deleteCollectionField,
} as const;
