import type { CorsairErrorHandler } from 'corsair/core';
import { SimplesatAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SimplesatAPIError ? error.status : undefined;
}

/**
 * Status codes: the shared responses in
 * https://developer.simplesat.io/api
 *
 * The unusual part is that a bad key is a **403**, not a 401: Simplesat answers
 * `403 Invalid Token.` for a missing or unrecognised token on every route.
 * mapped to AUTH_ERROR here, which is the opposite of most providers.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		// Simplesat documents no rate limit, so a 429 comes from a gateway, which
		// refused the request before the API saw it.
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SimplesatAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 and 403: the key is missing, unrecognised, or lacks the scope this route
	// needs. Simplesat uses 403 for all three, so both carry the same meaning.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof SimplesatAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such customer, response, answer or team member. 400: a field
	// failed validation, and the body names the field. Neither improves on a
	// retry.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx is worth replaying on a read. A write may already have landed: the
	// customer and team member routes are upserts, and a response create can
	// replace an existing response.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SimplesatAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
