import { dataApiOperations } from '../operations/data-api';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof dataApiOperations)[number]['name']) {
	const operation = dataApiOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const createProjectBranchDataAPIDefinition = getOperation(
	'createProjectBranchDataAPI',
);
export const createProjectBranchDataAPI: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createProjectBranchDataAPIDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createProjectBranchDataAPIDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createProjectBranchDataAPIDefinition);
	return result;
};

const getProjectBranchDataAPIDefinition = getOperation(
	'getProjectBranchDataAPI',
);
export const getProjectBranchDataAPI: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchDataAPIDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectBranchDataAPIDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getProjectBranchDataAPIDefinition);
	return result;
};

const updateProjectBranchDataAPIDefinition = getOperation(
	'updateProjectBranchDataAPI',
);
export const updateProjectBranchDataAPI: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateProjectBranchDataAPIDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateProjectBranchDataAPIDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateProjectBranchDataAPIDefinition);
	return result;
};

const deleteProjectBranchDataAPIDefinition = getOperation(
	'deleteProjectBranchDataAPI',
);
export const deleteProjectBranchDataAPI: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteProjectBranchDataAPIDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteProjectBranchDataAPIDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteProjectBranchDataAPIDefinition);
	return result;
};

export const DataApiEndpoints = {
	createProjectBranchDataAPI,
	getProjectBranchDataAPI,
	updateProjectBranchDataAPI,
	deleteProjectBranchDataAPI,
} as const;
