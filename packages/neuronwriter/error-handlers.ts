import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * NEURONwriter reports one error: a 401 `{ error }` for a bad or inactive key.
 * Its limits are monthly analysis counts rather than request rates, so a 429 is
 * not expected, but one from a gateway is handled anyway.
 *
 * Every method is a POST, so nothing here is replayed on a 5xx: starting an
 * analysis spends a credit, and a retry could bill twice.
 */
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A bad or inactive key. A retry sends the same key, so it cannot help.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 403 is a plan that does not include the API, which no retry changes.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Everything else the provider rejects is a body it could not read, which a
	// retry repeats. A Zod failure counts here too.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error.name === 'ZodError') return true;
			return [400, 404, 422].includes(statusOf(error) ?? 0);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// There is no SERVER_ERROR handler on purpose, because every method is a
	// POST and analysis.start spends a credit. A 5xx falls to DEFAULT.
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
