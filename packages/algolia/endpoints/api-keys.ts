import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createApiKeyRoute = getRoute('createApiKey');
export const createApiKey: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, createApiKeyRoute);
};

const deleteApiKeyRoute = getRoute('deleteApiKey');
export const deleteApiKey: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteApiKeyRoute);
};

const getApiKeyRoute = getRoute('getApiKey');
export const getApiKey: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getApiKeyRoute);
};

const listApiKeysRoute = getRoute('listApiKeys');
export const listApiKeys: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listApiKeysRoute);
};

const restoreApiKeyRoute = getRoute('restoreApiKey');
export const restoreApiKey: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, restoreApiKeyRoute);
};

const updateApiKeyRoute = getRoute('updateApiKey');
export const updateApiKey: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, updateApiKeyRoute);
};

export const ApiKeysEndpoints = {
	createApiKey,
	deleteApiKey,
	getApiKey,
	listApiKeys,
	restoreApiKey,
	updateApiKey,
} as const;
