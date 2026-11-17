import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { TwoCaptchaAPIError } from './client';

/**
 * 2Captcha's error vocabulary is a set of `ERROR_` codes on an HTTP 200
 * (https://2captcha.com/api-docs/error-codes). Only "no slot available" means
 * wait and try again; the rest are permanent. A non-200 answer is the
 * provider's own trouble and reaches here as core's ApiError.
 */
export const errorHandlers = {
	// `ERROR_ZERO_BALANCE`: the account cannot pay for the task. Nothing was
	// solved and no retry helps.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError && error.isInsufficientBalance,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `ERROR_CAPTCHA_UNSOLVABLE`: the workers could not solve it (2Captcha
	// returns the price). A retry means a new task, so the caller decides.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			return (
				error.name === 'ZodError' ||
				(error instanceof TwoCaptchaAPIError &&
					(error.isUnsolved ||
						error.code === 'ERROR_NO_SUCH_CAPCHA_ID' ||
						error.code === 'ERROR_BAD_PARAMETERS' ||
						error.code === 'ERROR_TASK_ABSENT' ||
						error.code === 'ERROR_TASK_NOT_SUPPORTED' ||
						error.code === 'ERROR_RECAPTCHA_INVALID_SITEKEY' ||
						error.code === 'ERROR_PAGEURL'))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// `ERROR_KEY_DOES_NOT_EXIST`, a blocked IP or a suspended account.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// `ERROR_NO_SLOT_AVAILABLE` on an HTTP 200: the queue is full and no task
	// was created, so trying again is safe even for createTask. An HTTP 429 is
	// retried by core's transport before it gets here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof TwoCaptchaAPIError && error.isRateLimit,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A 5xx: the docs say wait a few seconds and repeat. Only the two reads
	// are replayed: createTask may have been created and charged, and a report
	// may already have been filed.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			error.status >= 500 &&
			/\/(getBalance|getTaskResult)$/.test(
				String(error.url ?? '').split('?')[0] ?? '',
			),
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
