import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createSourceRoute = getRoute('createSource');
export const createSource: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, createSourceRoute);
};

const deleteSourceRoute = getRoute('deleteSource');
export const deleteSource: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteSourceRoute);
};

const getSourceRoute = getRoute('getSource');
export const getSource: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getSourceRoute);
};

const listSourcesRoute = getRoute('listSources');
export const listSources: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listSourcesRoute);
};

const searchSourcesRoute = getRoute('searchSources');
export const searchSources: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, searchSourcesRoute);
};

const updateSourceRoute = getRoute('updateSource');
export const updateSource: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, updateSourceRoute);
};

const validateSourceRoute = getRoute('validateSource');
export const validateSource: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, validateSourceRoute);
};

const validateSourceBeforeUpdateRoute = getRoute('validateSourceBeforeUpdate');
export const validateSourceBeforeUpdate: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, validateSourceBeforeUpdateRoute);
};

export const SourcesEndpoints = {
	createSource,
	deleteSource,
	getSource,
	listSources,
	searchSources,
	updateSource,
	validateSource,
	validateSourceBeforeUpdate,
} as const;
