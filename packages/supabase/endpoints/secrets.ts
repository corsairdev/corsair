import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { secretsOperations } from './operation-groups/secrets';

function getOperation(name: (typeof secretsOperations)[number]['name']) {
	const operation = secretsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const createBulkSecretsOperation = getOperation('createBulkSecrets');
export const createBulkSecrets: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createBulkSecretsOperation);
};

const deleteSecretsOperation = getOperation('deleteSecrets');
export const deleteSecrets: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deleteSecretsOperation);
};

const createApiKeyOperation = getOperation('createApiKey');
export const createApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, createApiKeyOperation);
};

const deleteApiKeyOperation = getOperation('deleteApiKey');
export const deleteApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, deleteApiKeyOperation);
};

const getProjectApiKeyOperation = getOperation('getProjectApiKey');
export const getProjectApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getProjectApiKeyOperation);
};

const getProjectApiKeysOperation = getOperation('getProjectApiKeys');
export const getProjectApiKeys: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, getProjectApiKeysOperation);
};

const getProjectLegacyApiKeysOperation = getOperation(
	'getProjectLegacyApiKeys',
);
export const getProjectLegacyApiKeys: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectLegacyApiKeysOperation);
};

const getProjectPgsodiumConfigOperation = getOperation(
	'getProjectPgsodiumConfig',
);
export const getProjectPgsodiumConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, getProjectPgsodiumConfigOperation);
};

const listSecretsOperation = getOperation('listSecrets');
export const listSecrets: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, listSecretsOperation);
};

const updateApiKeyOperation = getOperation('updateApiKey');
export const updateApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, updateApiKeyOperation);
};

const updatePgsodiumConfigOperation = getOperation('updatePgsodiumConfig');
export const updatePgsodiumConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updatePgsodiumConfigOperation);
};

const updateProjectLegacyApiKeysOperation = getOperation(
	'updateProjectLegacyApiKeys',
);
export const updateProjectLegacyApiKeys: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	return runSupabaseOperation(ctx, input, updateProjectLegacyApiKeysOperation);
};

export const SecretsEndpoints = {
	createBulkSecrets,
	deleteSecrets,
	createApiKey,
	deleteApiKey,
	getProjectApiKey,
	getProjectApiKeys,
	getProjectLegacyApiKeys,
	getProjectPgsodiumConfig,
	listSecrets,
	updateApiKey,
	updatePgsodiumConfig,
	updateProjectLegacyApiKeys,
} as const;
