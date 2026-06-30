import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';
import { secretsOperations } from '../operations/secrets';

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
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createBulkSecretsOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		createBulkSecretsOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, createBulkSecretsOperation);
	return result;
};

const deleteSecretsOperation = getOperation('deleteSecrets');
export const deleteSecrets: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteSecretsOperation,
	);
	await syncSupabaseOperationResult(ctx, deleteSecretsOperation, input, result);
	await logSupabaseOperation(ctx, input, deleteSecretsOperation);
	return result;
};

const createApiKeyOperation = getOperation('createApiKey');
export const createApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		createApiKeyOperation,
	);
	await syncSupabaseOperationResult(ctx, createApiKeyOperation, input, result);
	await logSupabaseOperation(ctx, input, createApiKeyOperation);
	return result;
};

const deleteApiKeyOperation = getOperation('deleteApiKey');
export const deleteApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		deleteApiKeyOperation,
	);
	await syncSupabaseOperationResult(ctx, deleteApiKeyOperation, input, result);
	await logSupabaseOperation(ctx, input, deleteApiKeyOperation);
	return result;
};

const getProjectApiKeyOperation = getOperation('getProjectApiKey');
export const getProjectApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectApiKeyOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectApiKeyOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectApiKeyOperation);
	return result;
};

const getProjectApiKeysOperation = getOperation('getProjectApiKeys');
export const getProjectApiKeys: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectApiKeysOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectApiKeysOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectApiKeysOperation);
	return result;
};

const getProjectLegacyApiKeysOperation = getOperation(
	'getProjectLegacyApiKeys',
);
export const getProjectLegacyApiKeys: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectLegacyApiKeysOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectLegacyApiKeysOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectLegacyApiKeysOperation);
	return result;
};

const getProjectPgsodiumConfigOperation = getOperation(
	'getProjectPgsodiumConfig',
);
export const getProjectPgsodiumConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		getProjectPgsodiumConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		getProjectPgsodiumConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, getProjectPgsodiumConfigOperation);
	return result;
};

const listSecretsOperation = getOperation('listSecrets');
export const listSecrets: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		listSecretsOperation,
	);
	await syncSupabaseOperationResult(ctx, listSecretsOperation, input, result);
	await logSupabaseOperation(ctx, input, listSecretsOperation);
	return result;
};

const updateApiKeyOperation = getOperation('updateApiKey');
export const updateApiKey: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateApiKeyOperation,
	);
	await syncSupabaseOperationResult(ctx, updateApiKeyOperation, input, result);
	await logSupabaseOperation(ctx, input, updateApiKeyOperation);
	return result;
};

const updatePgsodiumConfigOperation = getOperation('updatePgsodiumConfig');
export const updatePgsodiumConfig: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updatePgsodiumConfigOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updatePgsodiumConfigOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updatePgsodiumConfigOperation);
	return result;
};

const updateProjectLegacyApiKeysOperation = getOperation(
	'updateProjectLegacyApiKeys',
);
export const updateProjectLegacyApiKeys: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		updateProjectLegacyApiKeysOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		updateProjectLegacyApiKeysOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, updateProjectLegacyApiKeysOperation);
	return result;
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
