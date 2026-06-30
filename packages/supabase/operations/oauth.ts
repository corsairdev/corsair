import type { SupabaseOperation } from '../endpoints/operation-types';

export const oauthOperations = [
	{
		key: 'authorizeUserThroughOauth',
		group: 'oauth',
		name: 'authorizeUserThroughOauth',
		method: 'GET',
		path: '/v1/oauth/authorize',
		kind: 'oauthAuthorizeUrl',
		riskLevel: 'read',
		description: 'Generate a Supabase OAuth authorization URL',
	},
	{
		key: 'exchangeOauthToken',
		group: 'oauth',
		name: 'exchangeOauthToken',
		method: 'POST',
		path: '/v1/oauth/token',
		riskLevel: 'write',
		mediaType: 'application/x-www-form-urlencoded',
		description: 'Exchange an OAuth authorization code or refresh token',
	},
] as const satisfies readonly SupabaseOperation[];
