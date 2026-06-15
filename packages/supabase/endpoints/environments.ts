import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
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
	return runSupabaseOperation(ctx, input, countActionRunsOperation);
};

const createDatabaseBranchOperation = getOperation('createDatabaseBranch');
export const createDatabaseBranch: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, createDatabaseBranchOperation);
};

const deleteDatabaseBranchOperation = getOperation('deleteDatabaseBranch');
export const deleteDatabaseBranch: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, deleteDatabaseBranchOperation);
};

const disablePreviewBranchingOperation = getOperation(
	'disablePreviewBranching',
);
export const disablePreviewBranching: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, disablePreviewBranchingOperation);
};

const getBranchOperation = getOperation('getBranch');
export const getBranch: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getBranchOperation);
};

const getActionRunLogsOperation = getOperation('getActionRunLogs');
export const getActionRunLogs: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getActionRunLogsOperation);
};

const getActionRunOperation = getOperation('getActionRun');
export const getActionRun: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getActionRunOperation);
};

const getDatabaseBranchConfigOperation = getOperation(
	'getDatabaseBranchConfig',
);
export const getDatabaseBranchConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getDatabaseBranchConfigOperation);
};

const listDatabaseBranchesOperation = getOperation('listDatabaseBranches');
export const listDatabaseBranches: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, listDatabaseBranchesOperation);
};

const pushBranchOperation = getOperation('pushBranch');
export const pushBranch: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, pushBranchOperation);
};

const resetDatabaseBranchOperation = getOperation('resetDatabaseBranch');
export const resetDatabaseBranch: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, resetDatabaseBranchOperation);
};

const updateDatabaseBranchConfigOperation = getOperation(
	'updateDatabaseBranchConfig',
);
export const updateDatabaseBranchConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateDatabaseBranchConfigOperation);
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
