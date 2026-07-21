import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const clickedObjectIdsRoute = getRoute('clickedObjectIds');
export const clickedObjectIds: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, clickedObjectIdsRoute);
};

const clickedObjectIdsAfterSearchRoute = getRoute(
	'clickedObjectIdsAfterSearch',
);
export const clickedObjectIdsAfterSearch: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, clickedObjectIdsAfterSearchRoute);
};

const convertedObjectIdsRoute = getRoute('convertedObjectIds');
export const convertedObjectIds: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, convertedObjectIdsRoute);
};

const deleteUserTokenRoute = getRoute('deleteUserToken');
export const deleteUserToken: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteUserTokenRoute);
};

const initInsightsRoute = getRoute('initInsights');
export const initInsights: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, initInsightsRoute);
};

export const InsightsEndpoints = {
	clickedObjectIds,
	clickedObjectIdsAfterSearch,
	convertedObjectIds,
	deleteUserToken,
	initInsights,
} as const;
