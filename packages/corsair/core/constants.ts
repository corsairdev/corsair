import { z } from 'zod';

export type AllErrors =
	| 'RATE_LIMIT_ERROR'
	| 'AUTH_ERROR'
	| 'PERMISSION_ERROR'
	| 'NETWORK_ERROR'
	| 'TIMEOUT_ERROR'
	| 'SERVER_ERROR'
	| 'VALIDATION_ERROR'
	| 'NOT_FOUND_ERROR'
	| 'BAD_REQUEST_ERROR'
	| 'PARSING_ERROR'
	| 'DEFAULT'
	| (string & {});

export const BaseProviders = z.enum([
	'slack',
	'github',
	'linear',
	'hubspot',
	'gmail',
]);

export const AuthTypes = z.enum(['oauth_2', 'api_key', 'bot_token']);

export type BaseProviders = z.infer<typeof BaseProviders>;

export type AllProviders =
	| 'slack'
	| 'github'
	| 'linear'
	| 'hubspot'
	| 'gmail'
	| (string & {});

export type AuthTypes = z.infer<typeof AuthTypes>;
