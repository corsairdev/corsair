import { authOperations } from '../operations/auth';
import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';

function getOperation(name: (typeof authOperations)[number]['name']) {
	const operation = authOperations.find((candidate) => candidate.name === name);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const createSsoProviderOperation = getOperation('createSsoProvider');
export const createSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createSsoProviderOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createSsoProviderOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createSsoProviderOperation);
	return result;
};

const createThirdPartyAuthIntegrationOperation = getOperation(
	'createThirdPartyAuthIntegration',
);
export const createThirdPartyAuthIntegration: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createThirdPartyAuthIntegrationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createThirdPartyAuthIntegrationOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		createThirdPartyAuthIntegrationOperation,
	);
	return result;
};

const createProjectSigningKeyOperation = getOperation(
	'createProjectSigningKey',
);
export const createProjectSigningKey: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createProjectSigningKeyOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createProjectSigningKeyOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createProjectSigningKeyOperation);
	return result;
};

const deleteThirdPartyAuthIntegrationOperation = getOperation(
	'deleteThirdPartyAuthIntegration',
);
export const deleteThirdPartyAuthIntegration: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteThirdPartyAuthIntegrationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteThirdPartyAuthIntegrationOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		deleteThirdPartyAuthIntegrationOperation,
	);
	return result;
};

const getSsoProviderOperation = getOperation('getSsoProvider');
export const getSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getSsoProviderOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getSsoProviderOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getSsoProviderOperation);
	return result;
};

const getThirdPartyIntegrationOperation = getOperation(
	'getThirdPartyIntegration',
);
export const getThirdPartyIntegration: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getThirdPartyIntegrationOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getThirdPartyIntegrationOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getThirdPartyIntegrationOperation);
	return result;
};

const getLegacySigningKeyOperation = getOperation('getLegacySigningKey');
export const getLegacySigningKey: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getLegacySigningKeyOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getLegacySigningKeyOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getLegacySigningKeyOperation);
	return result;
};

const getProjectSigningKeysOperation = getOperation('getProjectSigningKeys');
export const getProjectSigningKeys: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectSigningKeysOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectSigningKeysOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectSigningKeysOperation);
	return result;
};

const getProjectAuthConfigOperation = getOperation('getProjectAuthConfig');
export const getProjectAuthConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectAuthConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectAuthConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectAuthConfigOperation);
	return result;
};

const listSsoProvidersOperation = getOperation('listSsoProviders');
export const listSsoProviders: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listSsoProvidersOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listSsoProvidersOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, listSsoProvidersOperation);
	return result;
};

const listThirdPartyAuthIntegrationsOperation = getOperation(
	'listThirdPartyAuthIntegrations',
);
export const listThirdPartyAuthIntegrations: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listThirdPartyAuthIntegrationsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		listThirdPartyAuthIntegrationsOperation,
		input,
		result,
	);
	await logSupabaseOperation(
		ctx,
		input,
		listThirdPartyAuthIntegrationsOperation,
	);
	return result;
};

const deleteSsoProviderOperation = getOperation('deleteSsoProvider');
export const deleteSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteSsoProviderOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		deleteSsoProviderOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, deleteSsoProviderOperation);
	return result;
};

const updateSsoProviderOperation = getOperation('updateSsoProvider');
export const updateSsoProvider: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateSsoProviderOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateSsoProviderOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateSsoProviderOperation);
	return result;
};

const updateProjectAuthConfigOperation = getOperation(
	'updateProjectAuthConfig',
);
export const updateProjectAuthConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectAuthConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectAuthConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateProjectAuthConfigOperation);
	return result;
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
