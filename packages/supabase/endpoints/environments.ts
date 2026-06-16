import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
import { environmentsOperations } from './operation-groups/environments';

function getOperation(name: (typeof environmentsOperations)[number]['name']) {
	const operation = environmentsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const countActionRunsOperation = getOperation('countActionRuns');
export const countActionRuns: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		countActionRunsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		countActionRunsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, countActionRunsOperation);
	return result;
};

const createDatabaseBranchOperation = getOperation('createDatabaseBranch');
export const createDatabaseBranch: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createDatabaseBranchOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createDatabaseBranchOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createDatabaseBranchOperation);
	return result;
};

const deleteDatabaseBranchOperation = getOperation('deleteDatabaseBranch');
export const deleteDatabaseBranch: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteDatabaseBranchOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteDatabaseBranchOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deleteDatabaseBranchOperation);
	return result;
};

const disablePreviewBranchingOperation = getOperation(
	'disablePreviewBranching',
);
export const disablePreviewBranching: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		disablePreviewBranchingOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		disablePreviewBranchingOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, disablePreviewBranchingOperation);
	return result;
};

const getBranchOperation = getOperation('getBranch');
export const getBranch: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(ctx, input, getBranchOperation);
	await syncSupabaseOperationResult(ctx, getBranchOperation, input, result);
	await logSupabaseOperation(ctx, input, getBranchOperation);
	return result;
};

const getActionRunLogsOperation = getOperation('getActionRunLogs');
export const getActionRunLogs: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getActionRunLogsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getActionRunLogsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getActionRunLogsOperation);
	return result;
};

const getActionRunOperation = getOperation('getActionRun');
export const getActionRun: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getActionRunOperation,
	);
	await syncSupabaseOperationResult(ctx, getActionRunOperation, input, result);
	await logSupabaseOperation(ctx, input, getActionRunOperation);
	return result;
};

const getDatabaseBranchConfigOperation = getOperation(
	'getDatabaseBranchConfig',
);
export const getDatabaseBranchConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getDatabaseBranchConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getDatabaseBranchConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getDatabaseBranchConfigOperation);
	return result;
};

const listDatabaseBranchesOperation = getOperation('listDatabaseBranches');
export const listDatabaseBranches: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listDatabaseBranchesOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listDatabaseBranchesOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listDatabaseBranchesOperation);
	return result;
};

const pushBranchOperation = getOperation('pushBranch');
export const pushBranch: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		pushBranchOperation,
	);
	await syncSupabaseOperationResult(ctx, pushBranchOperation, input, result);
	await logSupabaseOperation(ctx, input, pushBranchOperation);
	return result;
};

const resetDatabaseBranchOperation = getOperation('resetDatabaseBranch');
export const resetDatabaseBranch: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		resetDatabaseBranchOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		resetDatabaseBranchOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, resetDatabaseBranchOperation);
	return result;
};

const updateDatabaseBranchConfigOperation = getOperation(
	'updateDatabaseBranchConfig',
);
export const updateDatabaseBranchConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateDatabaseBranchConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateDatabaseBranchConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateDatabaseBranchConfigOperation);
	return result;
};

export const EnvironmentsEndpoints = {
	countActionRuns,
	createDatabaseBranch,
	deleteDatabaseBranch,
	disablePreviewBranching,
	getBranch,
	getActionRunLogs,
	getActionRun,
	getDatabaseBranchConfig,
	listDatabaseBranches,
	pushBranch,
	resetDatabaseBranch,
	updateDatabaseBranchConfig,
} as const;
