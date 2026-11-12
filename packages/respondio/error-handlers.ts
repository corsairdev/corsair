import type { CorsairErrorHandler } from 'corsair/core';
import { RespondioAPIError } from './client';

function apiError(error: Error): RespondioAPIError | undefined {
	return error instanceof RespondioAPIError ? error : undefined;
}

/**
 * Status codes: the overview at https://developers.respond.io/ and the Responses
 * section of each operation.
 */
export const errorHandlers = {
	// 5 requests a second per method and path, tracked independently, with a
	// Retry-After and X-RateLimit-* headers on the 429. A refused request ran
	// nothing, so replaying it is safe.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: the bearer token is missing, wrong or revoked. The body says
	// UN_AUTHORIZED, which is all it offers.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token is valid but the plan does not include the Developer API,
	// which needs Growth or above.
	PERMISSION_ERROR: {
		match: (error: Error) => apiError(error)?.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404: no contact matched the identifier, or the message does not exist.
	NOT_FOUND_ERROR: {
		match: (error: Error) => apiError(error)?.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 449: the message cannot be delivered on that channel, such as a Facebook or
	// Instagram message outside the 24-hour window without a messageTag, or a
	// contact that has not interacted on the chosen channel. The caller has to
	// change something, so it is not retried.
	UNPROCESSABLE_ERROR: {
		match: (error: Error) => apiError(error)?.isUnprocessable === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 422: a body respond.io refused, including an includeComments value other
	// than true or false.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx, and only for an operation that declared itself replayable: sending a
	// message or posting a comment is never retried, since a duplicate would
	// deliver twice.
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
