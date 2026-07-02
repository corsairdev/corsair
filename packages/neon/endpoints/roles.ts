import { rolesOperations } from '../operations/roles';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof rolesOperations)[number]['name']) {
	const operation = rolesOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const listProjectBranchRolesDefinition = getOperation('listProjectBranchRoles');
export const listProjectBranchRoles: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listProjectBranchRolesDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listProjectBranchRolesDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listProjectBranchRolesDefinition);
	return result;
};

const createProjectBranchRoleDefinition = getOperation(
	'createProjectBranchRole',
);
export const createProjectBranchRole: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createProjectBranchRoleDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		createProjectBranchRoleDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, createProjectBranchRoleDefinition);
	return result;
};

const getProjectBranchRoleDefinition = getOperation('getProjectBranchRole');
export const getProjectBranchRole: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchRoleDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectBranchRoleDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getProjectBranchRoleDefinition);
	return result;
};

const deleteProjectBranchRoleDefinition = getOperation(
	'deleteProjectBranchRole',
);
export const deleteProjectBranchRole: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteProjectBranchRoleDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteProjectBranchRoleDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteProjectBranchRoleDefinition);
	return result;
};

const getProjectBranchRolePasswordDefinition = getOperation(
	'getProjectBranchRolePassword',
);
export const getProjectBranchRolePassword: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getProjectBranchRolePasswordDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getProjectBranchRolePasswordDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getProjectBranchRolePasswordDefinition);
	return result;
};

const resetProjectBranchRolePasswordDefinition = getOperation(
	'resetProjectBranchRolePassword',
);
export const resetProjectBranchRolePassword: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		resetProjectBranchRolePasswordDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		resetProjectBranchRolePasswordDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, resetProjectBranchRolePasswordDefinition);
	return result;
};

export const RolesEndpoints = {
	listProjectBranchRoles,
	createProjectBranchRole,
	getProjectBranchRole,
	deleteProjectBranchRole,
	getProjectBranchRolePassword,
	resetProjectBranchRolePassword,
} as const;
