import type { CorsairErrorHandler } from 'corsair/core';
import { RemarketyAPIError } from './client';

function apiError(error: Error): RemarketyAPIError | undefined {
	return error instanceof RemarketyAPIError ? error : undefined;
}

/**
 * Status codes: the responses declared in the Swagger document, plus the live
 * 401 whose body is `{"message":"Missing or invalid API Key","status":"ERROR","guid":"…"}`.
 */
export const errorHandlers = {
	// 401: the token is missing or wrong; 403: it cannot reach this store.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no such store, campaign or rule.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.isNotFound === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422: a body Remarkety refused. The email-template route answers a 400
	// with an `errors` array, which the message already carries.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, if it arrives; the API documents no rate limit.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 5xx, and only for an operation that declared itself replayable. Creating a
	// contact or a store is never resent.
	SERVER_ERROR: {
		match: (error: Error) => (apiError(error)?.status ?? 0) >= 500,
		handler: async (error: Error) => {
			const replayable = apiError(error)?.replayable === true;
			return replayable
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 };
		},
	},
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
