import type { CorsairErrorHandler } from 'corsair/core';
import { RefinerAPIError } from './client';

function apiError(error: Error): RefinerAPIError | undefined {
	return error instanceof RefinerAPIError ? error : undefined;
}

/**
 * Status codes: the Errors and Rate Limits sections of https://refiner.io/docs/api/.
 */
export const errorHandlers = {
	// Three limits apply: 4,000 a minute and 1,000 per 15 seconds per key, and 100 a
	// minute per user. A 429 carries Retry-After and X-RateLimit-* headers, which
	// the client reads. A refused request ran nothing, so replaying is safe.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: "No API key found in headers". Live, Refiner answers this for a wrong key
	// and for no key at all, so there is nothing more specific to offer.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the account or role cannot reach the resource.
	PERMISSION_ERROR: {
		match: (error: Error) => apiError(error)?.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such contact, response, form or segment, or an unknown route.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409 on identify-user: another identify request for the same user is still
	// running. Refiner documents it as a conflict that clears on its own, so this
	// is the one failure worth waiting out.
	CONFLICT_ERROR: {
		match: (error: Error) => apiError(error)?.isConflict === true,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 400/405/422: a body Refiner refused, or the wrong method for the route.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx and 503, only for an operation that declared itself replayable. Tracking an
	// event or storing a response is never replayed, since a duplicate would look
	// like something that happened twice.
	SERVER_ERROR: {
		match: (error: Error) => (apiError(error)?.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable = apiError(error)?.replayable === true;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
	// No status: fetch failed or timed out before Refiner answered. Only a
	// replayable operation retries, for the same reason as a 5xx.
	NETWORK_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return api !== undefined && api.status === undefined && api.replayable;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 429 is handled above; anything else that is not a recognised status.
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/** Handlers match in key order and DEFAULT matches everything, so it stays last. */
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
