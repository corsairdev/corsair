import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const addOrReplaceRecordRoute = getRoute('addOrReplaceRecord');
export const addOrReplaceRecord: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, addOrReplaceRecordRoute);
};

const addRecordRoute = getRoute('addRecord');
export const addRecord: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, addRecordRoute);
};

const browseIndexRoute = getRoute('browseIndex');
export const browseIndex: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, browseIndexRoute);
};

const clearObjectsRoute = getRoute('clearObjects');
export const clearObjects: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, clearObjectsRoute);
};

const copyIndexRoute = getRoute('copyIndex');
export const copyIndex: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, copyIndexRoute);
};

const deleteIndexRoute = getRoute('deleteIndex');
export const deleteIndex: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteIndexRoute);
};

const deleteObjectsRoute = getRoute('deleteObjects');
export const deleteObjects: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteObjectsRoute);
};

const deleteRecordsByFilterRoute = getRoute('deleteRecordsByFilter');
export const deleteRecordsByFilter: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, deleteRecordsByFilterRoute);
};

const executeBatchOnMultipleIndicesRoute = getRoute(
	'executeBatchOnMultipleIndices',
);
export const executeBatchOnMultipleIndices: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(
		ctx,
		input,
		executeBatchOnMultipleIndicesRoute,
	);
};

const getRecommendTaskStatusRoute = getRoute('getRecommendTaskStatus');
export const getRecommendTaskStatus: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getRecommendTaskStatusRoute);
};

const getRecordRoute = getRoute('getRecord');
export const getRecord: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getRecordRoute);
};

const getSettingsRoute = getRoute('getSettings');
export const getSettings: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getSettingsRoute);
};

const getTaskStatusRoute = getRoute('getTaskStatus');
export const getTaskStatus: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getTaskStatusRoute);
};

const indexExistsRoute = getRoute('indexExists');
export const indexExists: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, indexExistsRoute);
};

const listIndicesRoute = getRoute('listIndices');
export const listIndices: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listIndicesRoute);
};

const partialUpdateObjectsRoute = getRoute('partialUpdateObjects');
export const partialUpdateObjects: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, partialUpdateObjectsRoute);
};

const setSettingsRoute = getRoute('setSettings');
export const setSettings: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, setSettingsRoute);
};

const updateRecordPartiallyRoute = getRoute('updateRecordPartially');
export const updateRecordPartially: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, updateRecordPartiallyRoute);
};

export const IndicesEndpoints = {
	addOrReplaceRecord,
	addRecord,
	browseIndex,
	clearObjects,
	copyIndex,
	deleteIndex,
	deleteObjects,
	deleteRecordsByFilter,
	executeBatchOnMultipleIndices,
	getRecommendTaskStatus,
	getRecord,
	getSettings,
	getTaskStatus,
	indexExists,
	listIndices,
	partialUpdateObjects,
	setSettings,
	updateRecordPartially,
} as const;
