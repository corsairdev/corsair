import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Needle has no machine-readable error code: every failure is `{ requestId,
 * error }`, so the status is the only classification. It arrives as core's
 * `ApiError`, whose `body` the client kept in sanitized form. A 409 on a lead
 * create is a duplicate identity, which the caller resolves with upsert.
 */
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	// Per-account limit. Needle sends Retry-After, and core's ApiError carries
	// it, so core's own rate-limit handling reads that header.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a revoked or invalid key. Retrying cannot fix it.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a key without the scope the route needs, or a plan limit.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422 are validation, 404 a missing lead or campaign, and 409 a
	// duplicate identity. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return [400, 404, 409, 422].includes(statusOf(error) ?? 0);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed. A 5xx on a send or an enroll may have gone
	// through, and Needle takes no idempotency key, so a POST is not matched.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.request.method === 'GET' &&
			error.status >= 500,
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
