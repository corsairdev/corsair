import type { CorsairErrorHandler } from 'corsair/core';
import { UnisenderAPIError } from './client';

function apiError(error: Error): UnisenderAPIError | undefined {
	return error instanceof UnisenderAPIError ? error : undefined;
}

/**
 * Codes: the standard table at
 * https://www.unisender.com/ru/support/api/common/api-errors/, plus the live
 * `invalid_api_key` at 401 and `access_denied` at 403.
 */
export const errorHandlers = {
	// A wrong key is invalid_api_key at 401; a missing key and a key with API access
	// switched off are access_denied at 403. Both mean "no call on this key", so they
	// share one handler and nothing is retried.
	AUTH_ERROR: {
		match: (error: Error) => apiError(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// not_enough_money: the balance is spent.
	QUOTA_ERROR: {
		match: (error: Error) => apiError(error)?.isQuotaError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// invalid_arg, and a 400. A retry sends the same argument.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const api = apiError(error);
			return error.name === 'ZodError' || api?.isValidationError === true;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// unknown_method: the method name is wrong, which is a code change, not a retry.
	UNKNOWN_METHOD_ERROR: {
		match: (error: Error) => apiError(error)?.isUnknownMethod === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The per-key or per-IP limit, named by Unisender as api_call_limit_exceeded_*.
	// It is 1200 a minute generally and 60 for sendEmail, so a short backoff works.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => apiError(error)?.isRateLimit === true,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: apiError(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// retry_later, which Unisender explicitly says to try again, and a 5xx — but only
	// for an operation that declared itself replayable.
	SERVER_ERROR: {
		match: (error: Error) => apiError(error)?.isRetryable === true,
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
