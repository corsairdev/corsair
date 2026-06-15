import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { authOperations } from './operation-groups/auth';

function getOperation(name: (typeof authOperations)[number]['name']) {
	const operation = authOperations.find((candidate) => candidate.name === name);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const createSsoProviderOperation = getOperation('createSsoProvider');
export const createSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createSsoProviderOperation);
};

const createThirdPartyAuthIntegrationOperation = getOperation(
	'createThirdPartyAuthIntegration',
);
export const createThirdPartyAuthIntegration: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		createThirdPartyAuthIntegrationOperation,
	);
};

const createProjectSigningKeyOperation = getOperation(
	'createProjectSigningKey',
);
export const createProjectSigningKey: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, createProjectSigningKeyOperation);
};

const deleteThirdPartyAuthIntegrationOperation = getOperation(
	'deleteThirdPartyAuthIntegration',
);
export const deleteThirdPartyAuthIntegration: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		deleteThirdPartyAuthIntegrationOperation,
	);
};

const getSsoProviderOperation = getOperation('getSsoProvider');
export const getSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getSsoProviderOperation);
};

const getThirdPartyIntegrationOperation = getOperation(
	'getThirdPartyIntegration',
);
export const getThirdPartyIntegration: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getThirdPartyIntegrationOperation);
};

const getLegacySigningKeyOperation = getOperation('getLegacySigningKey');
export const getLegacySigningKey: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getLegacySigningKeyOperation);
};

const getProjectSigningKeysOperation = getOperation('getProjectSigningKeys');
export const getProjectSigningKeys: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectSigningKeysOperation);
};

const getProjectAuthConfigOperation = getOperation('getProjectAuthConfig');
export const getProjectAuthConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectAuthConfigOperation);
};

const listSsoProvidersOperation = getOperation('listSsoProviders');
export const listSsoProviders: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listSsoProvidersOperation);
};

const listThirdPartyAuthIntegrationsOperation = getOperation(
	'listThirdPartyAuthIntegrations',
);
export const listThirdPartyAuthIntegrations: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(
		ctx,
		input,
		listThirdPartyAuthIntegrationsOperation,
	);
};

const deleteSsoProviderOperation = getOperation('deleteSsoProvider');
export const deleteSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deleteSsoProviderOperation);
};

const updateSsoProviderOperation = getOperation('updateSsoProvider');
export const updateSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, updateSsoProviderOperation);
};

const updateProjectAuthConfigOperation = getOperation(
	'updateProjectAuthConfig',
);
export const updateProjectAuthConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateProjectAuthConfigOperation);
};

export const AuthEndpoints = {
	createSsoProvider,
	createThirdPartyAuthIntegration,
	createProjectSigningKey,
	deleteThirdPartyAuthIntegration,
	getSsoProvider,
	getThirdPartyIntegration,
	getLegacySigningKey,
	getProjectSigningKeys,
	getProjectAuthConfig,
	listSsoProviders,
	listThirdPartyAuthIntegrations,
	deleteSsoProvider,
	updateSsoProvider,
	updateProjectAuthConfig,
} as const;
