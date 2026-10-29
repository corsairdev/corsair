import { collectionsOperations } from '../operations/collections';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof collectionsOperations)[number]['name']) {
	const operation = collectionsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listCollectionsDefinition = getOperation('listCollections');
export const listCollections: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listCollectionsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		listCollectionsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, listCollectionsDefinition);
	return result;
};

const createCollectionDefinition = getOperation('createCollection');
export const createCollection: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		createCollectionDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		createCollectionDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, createCollectionDefinition);
	return result;
};

const getCollectionDefinition = getOperation('getCollection');
export const getCollection: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getCollectionDefinition,
	);
	await syncWebflowOperationResult(ctx, getCollectionDefinition, input, result);
	await logWebflowOperation(ctx, input, getCollectionDefinition);
	return result;
};

const deleteCollectionDefinition = getOperation('deleteCollection');
export const deleteCollection: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		deleteCollectionDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		deleteCollectionDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, deleteCollectionDefinition);
	return result;
};

export const CollectionsEndpoints = {
	listCollections,
	createCollection,
	getCollection,
	deleteCollection,
} as const;
