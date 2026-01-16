import { z } from 'zod';

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
