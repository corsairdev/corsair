import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { edgeFunctionOperations } from './operation-groups/edge-functions';

function getOperation(name: (typeof edgeFunctionOperations)[number]['name']) {
	const operation = edgeFunctionOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const updateFunctionsOperation = getOperation('updateFunctions');
export const updateFunctions: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, updateFunctionsOperation);
};

const createFunctionOperation = getOperation('createFunction');
export const createFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createFunctionOperation);
};

const deleteFunctionOperation = getOperation('deleteFunction');
export const deleteFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deleteFunctionOperation);
};

const deployFunctionOperation = getOperation('deployFunction');
export const deployFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deployFunctionOperation);
};

const invokeEdgeFunctionOperation = getOperation('invokeEdgeFunction');
export const invokeEdgeFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, invokeEdgeFunctionOperation);
};

const listFunctionsOperation = getOperation('listFunctions');
export const listFunctions: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listFunctionsOperation);
};

const getFunctionOperation = getOperation('getFunction');
export const getFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getFunctionOperation);
};

const getFunctionBodyOperation = getOperation('getFunctionBody');
export const getFunctionBody: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getFunctionBodyOperation);
};

const updateFunctionOperation = getOperation('updateFunction');
export const updateFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, updateFunctionOperation);
};

export const EdgeFunctionsEndpoints = {
	updateFunctions,
	createFunction,
	deleteFunction,
	deployFunction,
	invokeEdgeFunction,
	listFunctions,
	getFunction,
	getFunctionBody,
	updateFunction,
} as const;
