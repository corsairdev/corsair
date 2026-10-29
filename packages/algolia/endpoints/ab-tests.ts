import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const addAbTestRoute = getRoute('addAbTest');
export const addAbTest: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, addAbTestRoute);
};

const deleteAbTestRoute = getRoute('deleteAbTest');
export const deleteAbTest: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteAbTestRoute);
};

const getAbTestRoute = getRoute('getAbTest');
export const getAbTest: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getAbTestRoute);
};

const listAbTestsRoute = getRoute('listAbTests');
export const listAbTests: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listAbTestsRoute);
};

const stopAbTestRoute = getRoute('stopAbTest');
export const stopAbTest: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, stopAbTestRoute);
};

export const AbTestsEndpoints = {
	addAbTest,
	deleteAbTest,
	getAbTest,
	listAbTests,
	stopAbTest,
} as const;
