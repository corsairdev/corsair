import type { CorsairErrorHandler } from 'corsair/core';
import { NeedleAPIError } from './client';

// Needle has no machine-readable error code: every failure is `{ requestId,
// error }`, so the status is the only classification. 409 on a lead create is a
// duplicate identity, which the caller resolves by using upsert instead.
export const errorHandlers = {
	// Per-account limit. Needle sends Retry-After, and the window is short, so
	// a read is worth retrying.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NeedleAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			// A Retry-After wins; without one the backoff still spans the window
			// Needle documents for a per-account limit.
			headersRetryAfterMs:
				error instanceof NeedleAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a revoked or invalid key. Retrying cannot fix it.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NeedleAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a key without the scope the route needs, or a plan limit. Neither
	// changes on a retry.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof NeedleAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422 are validation, 404 a missing lead or campaign, and 409 a
	// duplicate identity. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NeedleAPIError &&
				[400, 404, 409, 422].includes(error.status ?? 0)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A 5xx on a send or an enroll may have gone
	// through, and Needle has no idempotency key.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NeedleAPIError &&
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
