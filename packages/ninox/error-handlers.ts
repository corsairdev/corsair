import type { CorsairErrorHandler } from 'corsair/core';
import { NinoxAPIError } from './client';

// Ninox answers 401 for a missing or invalid workspace key and 403 for a key
// without the grant the resource needs. A 409 is either an `_expected` mismatch
// or an ambiguous upsert, and a 400 an untracked change feed or an unknown table.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NinoxAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NinoxAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a missing grant on a valid key, which a retry cannot change.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof NinoxAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 is an invalid filter or filterable column, 404 a missing table or row,
	// and 409 a stale `_expected` or an ambiguous upsert. 413 is an oversized
	// payload. None of them succeed on a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NinoxAPIError &&
				[400, 404, 409, 413].includes(error.status ?? 0)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only a GET is replayed. A create, update, delete or upsert inside a
	// transaction may have committed, and Ninox has no idempotency key.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NinoxAPIError &&
			error.method === 'GET' &&
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
