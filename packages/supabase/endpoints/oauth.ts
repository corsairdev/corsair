import type { SupabaseEndpoint } from './factory';
import { runSupabaseOperation } from './factory';
import { oauthOperations } from './operation-groups/oauth';

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
	return runSupabaseOperation(ctx, input, authorizeUserThroughOauthOperation);
};

const exchangeOauthTokenOperation = getOperation('exchangeOauthToken');
export const exchangeOauthToken: SupabaseEndpoint = async (ctx, input = {}) => {
	return runSupabaseOperation(ctx, input, exchangeOauthTokenOperation);
};

export const OAuthEndpoints = {
	authorizeUserThroughOauth,
	exchangeOauthToken,
} as const;
