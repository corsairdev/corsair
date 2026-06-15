import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { projectsOperations } from './operation-groups/projects';

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
	return runSupabaseOperation(
		ctx,
		input,
		updateProjectNetworkRestrictionsOperation,
	);
};

const createProjectOperation = getOperation('createProject');
export const createProject: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createProjectOperation);
};

const deleteProjectOperation = getOperation('deleteProject');
export const deleteProject: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deleteProjectOperation);
};

const getHealthOperation = getOperation('getHealth');
export const getHealth: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getHealthOperation);
};

const getAvailableRegionsOperation = getOperation('getAvailableRegions');
export const getAvailableRegions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getAvailableRegionsOperation);
};

const getProjectUpgradeEligibilityOperation = getOperation(
	'getProjectUpgradeEligibility',
);
export const getProjectUpgradeEligibility: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getProjectUpgradeEligibilityOperation,
	);
};

const getProjectOperation = getOperation('getProject');
export const getProject: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getProjectOperation);
};

const getProjectNetworkRestrictionsOperation = getOperation(
	'getProjectNetworkRestrictions',
);
export const getProjectNetworkRestrictions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getProjectNetworkRestrictionsOperation,
	);
};

const getProjectUpgradeStatusOperation = getOperation(
	'getProjectUpgradeStatus',
);
export const getProjectUpgradeStatus: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectUpgradeStatusOperation);
};

const getProjectServiceHealthStatusOperation = getOperation(
	'getProjectServiceHealthStatus',
);
export const getProjectServiceHealthStatus: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		getProjectServiceHealthStatusOperation,
	);
};

const listAllProjectsOperation = getOperation('listAllProjects');
export const listAllProjects: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listAllProjectsOperation);
};

const patchNetworkRestrictionsOperation = getOperation(
	'patchNetworkRestrictions',
);
export const patchNetworkRestrictions: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, patchNetworkRestrictionsOperation);
};

const removeNetworkBansOperation = getOperation('removeNetworkBans');
export const removeNetworkBans: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, removeNetworkBansOperation);
};

const getProjectNetworkBansOperation = getOperation('getProjectNetworkBans');
export const getProjectNetworkBans: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectNetworkBansOperation);
};

const updateProjectOperation = getOperation('updateProject');
export const updateProject: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, updateProjectOperation);
};

const upgradeProjectPostgresVersionOperation = getOperation(
	'upgradeProjectPostgresVersion',
);
export const upgradeProjectPostgresVersion: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		upgradeProjectPostgresVersionOperation,
	);
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
