import { oauthOperations } from '../operations/oauth';
import type { SupabaseEndpoint } from './factory';
import {
	logSupabaseOperation,
	requestSupabaseOperation,
	syncSupabaseOperationResult,
} from './factory';

function getOperation(name: (typeof oauthOperations)[number]['name']) {
	const operation = oauthOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[supabase] missing operation: ${name}`);
	}
	return operation;
}

const authorizeUserThroughOauthOperation = getOperation(
	'authorizeUserThroughOauth',
);
export const authorizeUserThroughOauth: SupabaseEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		authorizeUserThroughOauthOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		authorizeUserThroughOauthOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, authorizeUserThroughOauthOperation);
	return result;
};

const exchangeOauthTokenOperation = getOperation('exchangeOauthToken');
export const exchangeOauthToken: SupabaseEndpoint = async (ctx, input = {}) => {
	const result = await requestSupabaseOperation(
		ctx,
		input,
		exchangeOauthTokenOperation,
	);
	await syncSupabaseOperationResult(
		ctx,
		exchangeOauthTokenOperation,
		input,
		result,
	);
	await logSupabaseOperation(ctx, input, exchangeOauthTokenOperation);
	return result;
};

export const OAuthEndpoints = {
	authorizeUserThroughOauth,
	exchangeOauthToken,
} as const;
