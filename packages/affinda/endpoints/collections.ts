import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createCollectionRoute = getRoute('createCollection');
export const createCollection: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createCollectionRoute);
};

const createDataFieldForCollectionRoute = getRoute(
	'createDataFieldForCollection',
);
export const createDataFieldForCollection: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createDataFieldForCollectionRoute);
};

const deleteCollectionRoute = getRoute('deleteCollection');
export const deleteCollection: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteCollectionRoute);
};

const getCollectionRoute = getRoute('getCollection');
export const getCollection: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getCollectionRoute);
};

const getCollectionFieldsRoute = getRoute('getCollectionFields');
export const getCollectionFields: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getCollectionFieldsRoute);
};

const getCollectionsRoute = getRoute('getCollections');
export const getCollections: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getCollectionsRoute);
};

const getCollectionUsageRoute = getRoute('getCollectionUsage');
export const getCollectionUsage: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getCollectionUsageRoute);
};

const updateCollectionRoute = getRoute('updateCollection');
export const updateCollection: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateCollectionRoute);
};

const updateDataFieldForCollectionRoute = getRoute(
	'updateDataFieldForCollection',
);
export const updateDataFieldForCollection: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, updateDataFieldForCollectionRoute);
};

export const CollectionsEndpoints = {
	createCollection,
	createDataFieldForCollection,
	deleteCollection,
	getCollection,
	getCollectionFields,
	getCollections,
	getCollectionUsage,
	updateCollection,
	updateDataFieldForCollection,
} as const;
