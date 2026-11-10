import type { CorsairErrorHandler } from 'corsair/core';
import { TeamcampAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TeamcampAPIError ? error.status : undefined;
}

// Teamcamp documents no rate limit and sends no Retry-After. Its failures are
// the two body shapes the client reads: `{ error }` for a bad parameter, and a
// bare `"Invalid API key!!!"` string for a 403.
export const errorHandlers = {
	// A 401, or a 403 that was not resolved to a missing resource. A 403 on a
	// call carrying a resource id is the API's way of saying the project or task
	// is unknown, so it is handled below instead of here.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TeamcampAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A project or task that does not exist, or that this key cannot see.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof TeamcampAPIError &&
			(statusOf(error) === 404 || error.resourceNotFound),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if Teamcamp ever sends one. There is no documented backoff, so this
	// is exponential and a real Retry-After overrides it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TeamcampAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 400 names the missing or invalid field in `error`, and a retry sends the
	// same body.
	VALIDATION_ERROR: {
		match: (error: Error) => statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is Teamcamp's own trouble. Only a GET is safe to replay: a create or
	// a delete must never be sent twice.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof TeamcampAPIError && error.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and DEFAULT matches everything, so it stays last
 * even when the caller adds or overrides handlers. A plain spread would keep the
 * caller's value but the builtin's position, so a caller handler for a status no
 * builtin covers would never run.
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
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
