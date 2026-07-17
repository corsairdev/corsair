import { computeEndpointsOperations } from '../operations/compute-endpoints';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(
	name: (typeof computeEndpointsOperations)[number]['name'],
) {
	const operation = computeEndpointsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const createProjectEndpointDefinition = getOperation('createProjectEndpoint');
export const createProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createProjectEndpointDefinition);
	return result;
};

const listProjectEndpointsDefinition = getOperation('listProjectEndpoints');
export const listProjectEndpoints: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listProjectEndpointsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listProjectEndpointsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listProjectEndpointsDefinition);
	return result;
};

const getProjectEndpointDefinition = getOperation('getProjectEndpoint');
export const getProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getProjectEndpointDefinition);
	return result;
};

const updateProjectEndpointDefinition = getOperation('updateProjectEndpoint');
export const updateProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateProjectEndpointDefinition);
	return result;
};

const deleteProjectEndpointDefinition = getOperation('deleteProjectEndpoint');
export const deleteProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteProjectEndpointDefinition);
	return result;
};

const startProjectEndpointDefinition = getOperation('startProjectEndpoint');
export const startProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		startProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		startProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, startProjectEndpointDefinition);
	return result;
};

const suspendProjectEndpointDefinition = getOperation('suspendProjectEndpoint');
export const suspendProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		suspendProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		suspendProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, suspendProjectEndpointDefinition);
	return result;
};

const restartProjectEndpointDefinition = getOperation('restartProjectEndpoint');
export const restartProjectEndpoint: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		restartProjectEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		restartProjectEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, restartProjectEndpointDefinition);
	return result;
};

export const ComputeEndpointsEndpoints = {
	createProjectEndpoint,
	listProjectEndpoints,
	getProjectEndpoint,
	updateProjectEndpoint,
	deleteProjectEndpoint,
	startProjectEndpoint,
	suspendProjectEndpoint,
	restartProjectEndpoint,
} as const;
