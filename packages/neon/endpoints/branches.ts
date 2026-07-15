import { branchesOperations } from '../operations/branches';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof branchesOperations)[number]['name']) {
	const operation = branchesOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const createProjectBranchDefinition = getOperation('createProjectBranch');
export const createProjectBranch: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createProjectBranchDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createProjectBranchDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createProjectBranchDefinition);
	return result;
};

const listProjectBranchesDefinition = getOperation('listProjectBranches');
export const listProjectBranches: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listProjectBranchesDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listProjectBranchesDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listProjectBranchesDefinition);
	return result;
};

const countProjectBranchesDefinition = getOperation('countProjectBranches');
export const countProjectBranches: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		countProjectBranchesDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		countProjectBranchesDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, countProjectBranchesDefinition);
	return result;
};

const getProjectBranchDefinition = getOperation('getProjectBranch');
export const getProjectBranch: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchDefinition,
	);
	await syncNeonOperationResult(ctx, getProjectBranchDefinition, input, result);
	await logNeonOperation(ctx, input, getProjectBranchDefinition);
	return result;
};

const updateProjectBranchDefinition = getOperation('updateProjectBranch');
export const updateProjectBranch: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateProjectBranchDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateProjectBranchDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateProjectBranchDefinition);
	return result;
};

const deleteProjectBranchDefinition = getOperation('deleteProjectBranch');
export const deleteProjectBranch: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteProjectBranchDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteProjectBranchDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteProjectBranchDefinition);
	return result;
};

const restoreProjectBranchDefinition = getOperation('restoreProjectBranch');
export const restoreProjectBranch: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		restoreProjectBranchDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		restoreProjectBranchDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, restoreProjectBranchDefinition);
	return result;
};

const finalizeRestoreBranchDefinition = getOperation('finalizeRestoreBranch');
export const finalizeRestoreBranch: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		finalizeRestoreBranchDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		finalizeRestoreBranchDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, finalizeRestoreBranchDefinition);
	return result;
};

const setDefaultProjectBranchDefinition = getOperation(
	'setDefaultProjectBranch',
);
export const setDefaultProjectBranch: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		setDefaultProjectBranchDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		setDefaultProjectBranchDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, setDefaultProjectBranchDefinition);
	return result;
};

const getProjectBranchSchemaDefinition = getOperation('getProjectBranchSchema');
export const getProjectBranchSchema: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchSchemaDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectBranchSchemaDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getProjectBranchSchemaDefinition);
	return result;
};

const getProjectBranchSchemaComparisonDefinition = getOperation(
	'getProjectBranchSchemaComparison',
);
export const getProjectBranchSchemaComparison: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchSchemaComparisonDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectBranchSchemaComparisonDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		getProjectBranchSchemaComparisonDefinition,
	);
	return result;
};

const createProjectBranchAnonymizedDefinition = getOperation(
	'createProjectBranchAnonymized',
);
export const createProjectBranchAnonymized: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createProjectBranchAnonymizedDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createProjectBranchAnonymizedDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createProjectBranchAnonymizedDefinition);
	return result;
};

const getAnonymizedBranchStatusDefinition = getOperation(
	'getAnonymizedBranchStatus',
);
export const getAnonymizedBranchStatus: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getAnonymizedBranchStatusDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getAnonymizedBranchStatusDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getAnonymizedBranchStatusDefinition);
	return result;
};

const startAnonymizationDefinition = getOperation('startAnonymization');
export const startAnonymization: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		startAnonymizationDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		startAnonymizationDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, startAnonymizationDefinition);
	return result;
};

const getMaskingRulesDefinition = getOperation('getMaskingRules');
export const getMaskingRules: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getMaskingRulesDefinition,
	);
	await syncNeonOperationResult(ctx, getMaskingRulesDefinition, input, result);
	await logNeonOperation(ctx, input, getMaskingRulesDefinition);
	return result;
};

const updateMaskingRulesDefinition = getOperation('updateMaskingRules');
export const updateMaskingRules: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateMaskingRulesDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateMaskingRulesDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateMaskingRulesDefinition);
	return result;
};

const listProjectBranchEndpointsDefinition = getOperation(
	'listProjectBranchEndpoints',
);
export const listProjectBranchEndpoints: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listProjectBranchEndpointsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listProjectBranchEndpointsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listProjectBranchEndpointsDefinition);
	return result;
};

export const BranchesEndpoints = {
	createProjectBranch,
	listProjectBranches,
	countProjectBranches,
	getProjectBranch,
	updateProjectBranch,
	deleteProjectBranch,
	restoreProjectBranch,
	finalizeRestoreBranch,
	setDefaultProjectBranch,
	getProjectBranchSchema,
	getProjectBranchSchemaComparison,
	createProjectBranchAnonymized,
	getAnonymizedBranchStatus,
	startAnonymization,
	getMaskingRules,
	updateMaskingRules,
	listProjectBranchEndpoints,
} as const;
