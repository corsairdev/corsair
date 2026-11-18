import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NewrelicAPIError } from './client';

/**
 * An HTTP failure arrives as core's `ApiError`, so its status and Retry-After
 * reach both these handlers and core (R8). `NewrelicAPIError` now covers one
 * case only: a GraphQL call that answered 200 with an `errors` array, which is
 * a bad query rather than a transport failure.
 */
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** The method of the failed request, so a replay can be limited to reads. */
function methodOf(error: Error): string | undefined {
	return error instanceof ApiError ? error.request.method : undefined;
}

// New Relic documents a 429 with Retry-After for a key over its rate limit, a
// 401 for a bad or expired user key, and a 403 for a key without the role the
// call needs. Reads are safe to replay; a policy create or delete is not.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 is a valid key whose role does not allow the call, which a retry
	// cannot change. So is a GraphQL FORBIDDEN extension code, which arrives on a
	// 200 and is checked first so it is not read as a bad query.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 ||
			(error instanceof NewrelicAPIError && error.isPermissionError),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 or 422 is a body New Relic refused, and a 404 a missing policy or
	// application. A bad NRQL query arrives as a 200 with an errors array; it
	// needs the query changed, not a retry.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			error instanceof NewrelicAPIError ||
			statusOf(error) === 400 ||
			statusOf(error) === 404 ||
			statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only a GET is replayed. A policy create or delete may have gone through.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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
