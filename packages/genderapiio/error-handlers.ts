import type { CorsairErrorHandler } from 'corsair/core';
import { GENDERAPIIO_ERROR_CODES, GenderApiIoAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof GenderApiIoAPIError ? error.status : undefined;
}

/**
 * GenderAPI.io publishes a machine-readable error catalog at
 * `/api/v2/errors`, and every failure is an RFC 7807 problem document with a
 * `code` and an `action`. The handlers follow those actions rather than the
 * status alone, because the catalog distinguishes cases a status cannot.
 * Reference: https://genderapi.io/api-documentation
 */
export const errorHandlers = {
	// 429 covers `rate_limit_exceeded` and `concurrency_limit`. The catalog says to
	// respect Retry-After, so the handler does. A retry is a new billed operation,
	// which is why the attempt count stays low.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof GenderApiIoAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A key the API refused, or a missing header where the route needs one.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A key that exists but cannot be used. The catalog says these do not fall
	// back to an IP trial, so there is nothing to retry.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 422 body, a 400 query, or a value a zod schema refused.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(error instanceof GenderApiIoAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// An unknown route. A retry asks for the same route.
	NOT_FOUND: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A billed POST that failed with a 5xx, a timeout or a dropped connection may
	// already be charged, and the catalog says to inspect billing before
	// retrying rather than to retry automatically. Retrying would start a new
	// billed operation. This sits above SERVER, TIMEOUT and NETWORK so those only
	// retry the free GET routes.
	BILLING_CHECK_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.needsBillingCheck,
		handler: async () => ({ maxRetries: 0 }),
	},
	// AI is unavailable on this deployment. The catalog says a dataset-only
	// request can still work with `ai_mode: 'off'`, so the same request is not
	// retried as-is.
	AI_UNAVAILABLE_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError &&
			error.code === GENDERAPIIO_ERROR_CODES.AI_UNAVAILABLE,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Their internal failure, or a 5xx the catalog does not name.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && (error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.timedOut,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof GenderApiIoAPIError && error.transport,
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

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
