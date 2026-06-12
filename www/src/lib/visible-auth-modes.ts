import type { AuthMode } from '@/db/schema';

/** Auth modes shown on OSS and available for contributors to claim. */
export const VISIBLE_AUTH_MODES = [
	'API_KEY',
	'OAUTH2',
	'BASIC',
	'BEARER_TOKEN',
	'NO_AUTH',
] as const satisfies readonly AuthMode[];

export const visibleAuthModes = [...VISIBLE_AUTH_MODES] as AuthMode[];
