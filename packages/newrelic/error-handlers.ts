import type { CorsairErrorHandler } from 'corsair/core';
import { NewrelicAPIError } from './client';

// New Relic documents a 429 with Retry-After for a key over its rate limit, a
// 401 for a bad or expired user key, and a 403 for a key without the role the
// call needs. Reads are safe to replay; a policy create or delete is not.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof NewrelicAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof NewrelicAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof NewrelicAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 is a valid key whose role does not allow the call, which a retry
	// cannot change. So is a GraphQL FORBIDDEN extension code.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof NewrelicAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 400 or 422 is a body New Relic refused, and a 404 a missing policy or
	// application. A bad NRQL query arrives as a 200 with an errors array, which
	// the client raises with status 200; it needs the query changed, not a retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return (
				error instanceof NewrelicAPIError &&
				(error.status === 400 ||
					error.status === 404 ||
					error.status === 422 ||
					(error.status === 200 && error.messages.length > 0))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only a GET is replayed. A policy create or delete may have gone through.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof NewrelicAPIError &&
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
