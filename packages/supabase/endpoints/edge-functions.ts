import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
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
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateFunctionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateFunctionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateFunctionsOperation);
	return result;
};

const createFunctionOperation = getOperation('createFunction');
export const createFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createFunctionOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createFunctionOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createFunctionOperation);
	return result;
};

const deleteFunctionOperation = getOperation('deleteFunction');
export const deleteFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteFunctionOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteFunctionOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deleteFunctionOperation);
	return result;
};

const deployFunctionOperation = getOperation('deployFunction');
export const deployFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deployFunctionOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deployFunctionOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deployFunctionOperation);
	return result;
};

const invokeEdgeFunctionOperation = getOperation('invokeEdgeFunction');
export const invokeEdgeFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		invokeEdgeFunctionOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		invokeEdgeFunctionOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, invokeEdgeFunctionOperation);
	return result;
};

const listFunctionsOperation = getOperation('listFunctions');
export const listFunctions: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listFunctionsOperation,
	);
	await syncSupabaseOperationResult(ctx, listFunctionsOperation, input, result);
	await logSupabaseOperation(ctx, input, listFunctionsOperation);
	return result;
};

const getFunctionOperation = getOperation('getFunction');
export const getFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getFunctionOperation,
	);
	await syncSupabaseOperationResult(ctx, getFunctionOperation, input, result);
	await logSupabaseOperation(ctx, input, getFunctionOperation);
	return result;
};

const getFunctionBodyOperation = getOperation('getFunctionBody');
export const getFunctionBody: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getFunctionBodyOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getFunctionBodyOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getFunctionBodyOperation);
	return result;
};

const updateFunctionOperation = getOperation('updateFunction');
export const updateFunction: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateFunctionOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateFunctionOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateFunctionOperation);
	return result;
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
