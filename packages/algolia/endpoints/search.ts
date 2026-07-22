import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const findObjectRoute = getRoute('findObject');
export const findObject: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, findObjectRoute);
};

const getObjectPositionRoute = getRoute('getObjectPosition');
export const getObjectPosition: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getObjectPositionRoute);
};

const getObjectsRoute = getRoute('getObjects');
export const getObjects: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getObjectsRoute);
};

const searchFacetValuesRoute = getRoute('searchFacetValues');
export const searchFacetValues: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, searchFacetValuesRoute);
};

const searchIndexRoute = getRoute('searchIndex');
export const searchIndex: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, searchIndexRoute);
};

const searchMultipleIndicesRoute = getRoute('searchMultipleIndices');
export const searchMultipleIndices: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, searchMultipleIndicesRoute);
};

export const SearchEndpoints = {
	findObject,
	getObjectPosition,
	getObjects,
	searchFacetValues,
	searchIndex,
	searchMultipleIndices,
} as const;
