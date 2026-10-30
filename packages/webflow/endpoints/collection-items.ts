import { collectionItemsOperations } from '../operations/collection-items';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(
	name: (typeof collectionItemsOperations)[number]['name'],
) {
	const operation = collectionItemsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listCollectionItemsDefinition = getOperation('listCollectionItems');
export const listCollectionItems: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listCollectionItemsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		listCollectionItemsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, listCollectionItemsDefinition);
	return result;
};

const getCollectionItemDefinition = getOperation('getCollectionItem');
export const getCollectionItem: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getCollectionItemDefinition);
	return result;
};

const createCollectionItemDefinition = getOperation('createCollectionItem');
export const createCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		createCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		createCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, createCollectionItemDefinition);
	return result;
};

const createBulkCollectionItemsDefinition = getOperation(
	'createBulkCollectionItems',
);
export const createBulkCollectionItems: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		createBulkCollectionItemsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		createBulkCollectionItemsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, createBulkCollectionItemsDefinition);
	return result;
};

const updateCollectionItemDefinition = getOperation('updateCollectionItem');
export const updateCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updateCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updateCollectionItemDefinition);
	return result;
};

const updateCollectionItemLegacyDefinition = getOperation(
	'updateCollectionItemLegacy',
);
export const updateCollectionItemLegacy: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateCollectionItemLegacyDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updateCollectionItemLegacyDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updateCollectionItemLegacyDefinition);
	return result;
};

const deleteCollectionItemDefinition = getOperation('deleteCollectionItem');
export const deleteCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		deleteCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		deleteCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, deleteCollectionItemDefinition);
	return result;
};

const deleteCollectionItemsDefinition = getOperation('deleteCollectionItems');
export const deleteCollectionItems: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		deleteCollectionItemsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		deleteCollectionItemsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, deleteCollectionItemsDefinition);
	return result;
};

const publishCollectionItemsDefinition = getOperation('publishCollectionItems');
export const publishCollectionItems: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		publishCollectionItemsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		publishCollectionItemsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, publishCollectionItemsDefinition);
	return result;
};

const getLiveCollectionItemDefinition = getOperation('getLiveCollectionItem');
export const getLiveCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getLiveCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getLiveCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getLiveCollectionItemDefinition);
	return result;
};

const createLiveCollectionItemDefinition = getOperation(
	'createLiveCollectionItem',
);
export const createLiveCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		createLiveCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		createLiveCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, createLiveCollectionItemDefinition);
	return result;
};

const updateLiveCollectionItemDefinition = getOperation(
	'updateLiveCollectionItem',
);
export const updateLiveCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateLiveCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updateLiveCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updateLiveCollectionItemDefinition);
	return result;
};

const updateLiveCollectionItemsDefinition = getOperation(
	'updateLiveCollectionItems',
);
export const updateLiveCollectionItems: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateLiveCollectionItemsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updateLiveCollectionItemsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updateLiveCollectionItemsDefinition);
	return result;
};

const unpublishLiveCollectionItemDefinition = getOperation(
	'unpublishLiveCollectionItem',
);
export const unpublishLiveCollectionItem: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		unpublishLiveCollectionItemDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		unpublishLiveCollectionItemDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, unpublishLiveCollectionItemDefinition);
	return result;
};

const unpublishLiveCollectionItemsDefinition = getOperation(
	'unpublishLiveCollectionItems',
);
export const unpublishLiveCollectionItems: WebflowEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		unpublishLiveCollectionItemsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		unpublishLiveCollectionItemsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, unpublishLiveCollectionItemsDefinition);
	return result;
};

export const CollectionItemsEndpoints = {
	listCollectionItems,
	getCollectionItem,
	createCollectionItem,
	createBulkCollectionItems,
	updateCollectionItem,
	updateCollectionItemLegacy,
	deleteCollectionItem,
	deleteCollectionItems,
	publishCollectionItems,
	getLiveCollectionItem,
	createLiveCollectionItem,
	updateLiveCollectionItem,
	updateLiveCollectionItems,
	unpublishLiveCollectionItem,
	unpublishLiveCollectionItems,
} as const;
