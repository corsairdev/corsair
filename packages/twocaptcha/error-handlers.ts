import type { CorsairErrorHandler } from 'corsair/core';
import { TwoCaptchaAPIError } from './client';

/**
 * 2Captcha's error vocabulary is a set of `ERROR_` codes, and most arrive on an
 * HTTP 200. The docs say each one is permanent except for two: the request
 * limit and "no slot available", which mean wait and try again.
 */
export const errorHandlers = {
	// `ERROR_ZERO_BALANCE`: the account cannot pay for the task. Nothing was
	// solved and no retry helps.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError && error.isInsufficientBalance,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `ERROR_CAPTCHA_UNSOLVABLE`: the workers could not solve it. A retry would
	// create a new billable task, so the caller decides rather than the plugin.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			return (
				error.name === 'ZodError' ||
				(error instanceof TwoCaptchaAPIError &&
					(error.isUnsolved ||
						error.code === 'ERROR_WRONG_CAPTCHA_ID' ||
						error.code === 'ERROR_BAD_PARAMETERS' ||
						error.code === 'ERROR_WRONG_GOOGLEKEY' ||
						error.code === 'ERROR_WRONG_PAGEURL'))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// `ERROR_WRONG_USER_KEY` and `ERROR_KEY_DOES_NOT_EXIST`.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, `ERROR_TOO_MANY_REQUESTS` or `ERROR_NO_SLOT_AVAILABLE`: the queue is
	// full. Both answer on HTTP 200, so the code is what identifies them.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof TwoCaptchaAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx is the provider's own trouble; the docs say to retry with backoff.
	// Only reads are replayed: `createTask` is billable and not idempotent.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError &&
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
// keys come first and DEFAULT stays last.
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
