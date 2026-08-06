import { projectsOperations } from '../operations/projects';
import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';

function getOperation(name: (typeof projectsOperations)[number]['name']) {
	const operation = projectsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const updateProjectNetworkRestrictionsOperation = getOperation(
	'updateProjectNetworkRestrictions',
);
export const updateProjectNetworkRestrictions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectNetworkRestrictionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectNetworkRestrictionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		updateProjectNetworkRestrictionsOperation,
	);
	return result;
};

const createProjectOperation = getOperation('createProject');
export const createProject: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createProjectOperation,
	);
	await syncSupabaseOperationResult(ctx, createProjectOperation, input, result);
	await logSupabaseOperation(ctx, input, createProjectOperation);
	return result;
};

const deleteProjectOperation = getOperation('deleteProject');
export const deleteProject: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteProjectOperation,
	);
	await syncSupabaseOperationResult(ctx, deleteProjectOperation, input, result);
	await logSupabaseOperation(ctx, input, deleteProjectOperation);
	return result;
};

const getHealthOperation = getOperation('getHealth');
export const getHealth: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(ctx, input, getHealthOperation);
	await syncSupabaseOperationResult(ctx, getHealthOperation, input, result);
	await logSupabaseOperation(ctx, input, getHealthOperation);
	return result;
};

const getAvailableRegionsOperation = getOperation('getAvailableRegions');
export const getAvailableRegions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getAvailableRegionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getAvailableRegionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getAvailableRegionsOperation);
	return result;
};

const getProjectUpgradeEligibilityOperation = getOperation(
	'getProjectUpgradeEligibility',
);
export const getProjectUpgradeEligibility: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectUpgradeEligibilityOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectUpgradeEligibilityOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectUpgradeEligibilityOperation);
	return result;
};

const getProjectOperation = getOperation('getProject');
export const getProject: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectOperation,
	);
	await syncSupabaseOperationResult(ctx, getProjectOperation, input, result);
	await logSupabaseOperation(ctx, input, getProjectOperation);
	return result;
};

const getProjectNetworkRestrictionsOperation = getOperation(
	'getProjectNetworkRestrictions',
);
export const getProjectNetworkRestrictions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectNetworkRestrictionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectNetworkRestrictionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		getProjectNetworkRestrictionsOperation,
	);
	return result;
};

const getProjectUpgradeStatusOperation = getOperation(
	'getProjectUpgradeStatus',
);
export const getProjectUpgradeStatus: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectUpgradeStatusOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectUpgradeStatusOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectUpgradeStatusOperation);
	return result;
};

const getProjectServiceHealthStatusOperation = getOperation(
	'getProjectServiceHealthStatus',
);
export const getProjectServiceHealthStatus: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectServiceHealthStatusOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectServiceHealthStatusOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		getProjectServiceHealthStatusOperation,
	);
	return result;
};

const listAllProjectsOperation = getOperation('listAllProjects');
export const listAllProjects: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listAllProjectsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listAllProjectsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listAllProjectsOperation);
	return result;
};

const patchNetworkRestrictionsOperation = getOperation(
	'patchNetworkRestrictions',
);
export const patchNetworkRestrictions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		patchNetworkRestrictionsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		patchNetworkRestrictionsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, patchNetworkRestrictionsOperation);
	return result;
};

const removeNetworkBansOperation = getOperation('removeNetworkBans');
export const removeNetworkBans: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		removeNetworkBansOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		removeNetworkBansOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, removeNetworkBansOperation);
	return result;
};

const getProjectNetworkBansOperation = getOperation('getProjectNetworkBans');
export const getProjectNetworkBans: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectNetworkBansOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectNetworkBansOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectNetworkBansOperation);
	return result;
};

const updateProjectOperation = getOperation('updateProject');
export const updateProject: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectOperation,
	);
	await syncSupabaseOperationResult(ctx, updateProjectOperation, input, result);
	await logSupabaseOperation(ctx, input, updateProjectOperation);
	return result;
};

const upgradeProjectPostgresVersionOperation = getOperation(
	'upgradeProjectPostgresVersion',
);
export const upgradeProjectPostgresVersion: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		upgradeProjectPostgresVersionOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		upgradeProjectPostgresVersionOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		upgradeProjectPostgresVersionOperation,
	);
	return result;
};

export const ProjectsEndpoints = {
	updateProjectNetworkRestrictions,
	createProject,
	deleteProject,
	getHealth,
	getAvailableRegions,
	getProjectUpgradeEligibility,
	getProject,
	getProjectNetworkRestrictions,
	getProjectUpgradeStatus,
	getProjectServiceHealthStatus,
	listAllProjects,
	patchNetworkRestrictions,
	removeNetworkBans,
	getProjectNetworkBans,
	updateProject,
	upgradeProjectPostgresVersion,
} as const;
