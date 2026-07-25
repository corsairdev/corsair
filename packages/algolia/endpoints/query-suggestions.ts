import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createQsConfigRoute = getRoute('createQsConfig');
export const createQsConfig: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, createQsConfigRoute);
};

const deleteConfigRoute = getRoute('deleteConfig');
export const deleteConfig: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteConfigRoute);
};

const getConfigRoute = getRoute('getConfig');
export const getConfig: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getConfigRoute);
};

const listQsConfigsRoute = getRoute('listQsConfigs');
export const listQsConfigs: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listQsConfigsRoute);
};

const updateConfigRoute = getRoute('updateConfig');
export const updateConfig: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, updateConfigRoute);
};

export const QuerySuggestionsEndpoints = {
	createQsConfig,
	deleteConfig,
	getConfig,
	listQsConfigs,
	updateConfig,
} as const;
