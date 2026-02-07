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

export const BaseProviders = [
	'slack',
	'github',
	'linear',
	'hubspot',
	'gmail',
	'resend',
] as const;

export type AllProviders =
	| 'slack'
	| 'github'
	| 'linear'
	| 'hubspot'
	| 'gmail'
	| 'resend'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token';

export type PickAuth<T extends AuthTypes> = T;
