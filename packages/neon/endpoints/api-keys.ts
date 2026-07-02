import { apiKeysOperations } from '../operations/api-keys';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof apiKeysOperations)[number]['name']) {
	const operation = apiKeysOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const listApiKeysDefinition = getOperation('listApiKeys');
export const listApiKeys: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(ctx, input, listApiKeysDefinition);
	await syncNeonOperationResult(ctx, listApiKeysDefinition, input, result);
	await logNeonOperation(ctx, input, listApiKeysDefinition);
	return result;
};

const createApiKeyDefinition = getOperation('createApiKey');
export const createApiKey: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(ctx, input, createApiKeyDefinition);
	await syncNeonOperationResult(ctx, createApiKeyDefinition, input, result);
	await logNeonOperation(ctx, input, createApiKeyDefinition);
	return result;
};

const revokeApiKeyDefinition = getOperation('revokeApiKey');
export const revokeApiKey: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(ctx, input, revokeApiKeyDefinition);
	await syncNeonOperationResult(ctx, revokeApiKeyDefinition, input, result);
	await logNeonOperation(ctx, input, revokeApiKeyDefinition);
	return result;
};

export const ApiKeysEndpoints = {
	listApiKeys,
	createApiKey,
	revokeApiKey,
} as const;
