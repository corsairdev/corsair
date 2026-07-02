import { databasesOperations } from '../operations/databases';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof databasesOperations)[number]['name']) {
	const operation = databasesOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const listProjectBranchDatabasesDefinition = getOperation(
	'listProjectBranchDatabases',
);
export const listProjectBranchDatabases: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listProjectBranchDatabasesDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listProjectBranchDatabasesDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listProjectBranchDatabasesDefinition);
	return result;
};

const createProjectBranchDatabaseDefinition = getOperation(
	'createProjectBranchDatabase',
);
export const createProjectBranchDatabase: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createProjectBranchDatabaseDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createProjectBranchDatabaseDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createProjectBranchDatabaseDefinition);
	return result;
};

const getProjectBranchDatabaseDefinition = getOperation(
	'getProjectBranchDatabase',
);
export const getProjectBranchDatabase: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchDatabaseDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectBranchDatabaseDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getProjectBranchDatabaseDefinition);
	return result;
};

const updateProjectBranchDatabaseDefinition = getOperation(
	'updateProjectBranchDatabase',
);
export const updateProjectBranchDatabase: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateProjectBranchDatabaseDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		updateProjectBranchDatabaseDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, updateProjectBranchDatabaseDefinition);
	return result;
};

const deleteProjectBranchDatabaseDefinition = getOperation(
	'deleteProjectBranchDatabase',
);
export const deleteProjectBranchDatabase: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteProjectBranchDatabaseDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteProjectBranchDatabaseDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteProjectBranchDatabaseDefinition);
	return result;
};

export const DatabasesEndpoints = {
	listProjectBranchDatabases,
	createProjectBranchDatabase,
	getProjectBranchDatabase,
	updateProjectBranchDatabase,
	deleteProjectBranchDatabase,
} as const;
