import type { CorsairErrorHandler } from 'corsair/core';
import { NeutrinoAPIError } from './client';

// Neutrino sends `{ "api-error": <number>, "api-error-msg": "..." }` with the
// status. Code 43 is the credential check; other 403s are plan or permission
// limits. Most routes are reads, so a 5xx on one can be replayed.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NeutrinoAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Code 43 is a bad user id or key. Retrying sends the same pair.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NeutrinoAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 with another code is a plan or permission limit.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof NeutrinoAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 is a parameter Neutrino refused. A schema failure is caught here
	// before the call is made.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return error instanceof NeutrinoAPIError && error.status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// One route is not a safe replay despite being a GET: messaging.smsVerify
	// sends a real SMS, so a 5xx could mean the message went out. It is tagged
	// as non-replayable by the endpoint, and only the untagged reads retry.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NeutrinoAPIError &&
			!error.sendsMessage &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so the caller's
// keys go first, then any builtin they did not name, then one DEFAULT.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
