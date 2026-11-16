import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Status codes: https://support.simplekpi.com/ai-core/api/errors
 *
 * Two limits apply and both answer 429 with a Retry-After: 300 per 60 seconds
 * per client and 600 per 60 seconds per key.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Core's request() already retried it three times with Retry-After.
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: the key was missing, malformed, unrecognised, expired or revoked.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but lacks the scope this route needs. Write does not
	// imply read here, so a key that can push entries still cannot list them.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 with a field map: a value failed validation, such as a frequency the
	// account does not have or a date the KPI's frequency rejects. 404: no such resource, or
	// one under a different parent. 409: a duplicate name or a resource in use.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 409
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying on a read. A write may already have landed: the
	// entry routes are upserts and the batch route always answers 200, so a
	// replay can double a `addToActual` increment.
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
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. Caller keys come first so a
 * handler they added actually runs.
 */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) {
			merged[name as keyof CorsairErrorHandler] = entry;
		}
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
