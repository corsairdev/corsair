import type { CorsairErrorHandler } from 'corsair/core';
import { VirustotalAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof VirustotalAPIError ? error.status : undefined;
}

/**
 * Codes: https://docs.virustotal.com/reference/errors
 *
 * The important split is the two 429s. `TooManyRequestsError` is a burst that
 * clears, so a retry can work; `QuotaExceededError` means a minute, daily or
 * monthly allowance is spent, and retrying only burns another request against
 * a quota that is already gone.
 */
export const errorHandlers = {
	// Only the burst variant. A quota is deliberately not matched here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof VirustotalAPIError && error.isRateLimited,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof VirustotalAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A spent quota: nothing to wait for, and the caller has to change plan or
	// wait for the reset at 00:00 UTC.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof VirustotalAPIError && error.isQuotaExceeded,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401, or one of the three codes for a missing, wrong or inactive key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof VirustotalAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key is valid but the plan does not include the feature.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 404 or NotFoundError: the file, URL, domain or comment is unknown.
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof VirustotalAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 NotAvailableYet: the object exists but has not been processed. It is
	// worth waiting for, but polling is the caller's choice, so it is not
	// retried automatically.
	NOT_READY_ERROR: {
		match: (error: Error) =>
			error instanceof VirustotalAPIError && error.isNotAvailableYet,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 409 AlreadyExistsError, 424 FailedDependencyError, and a ZodError.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				status === 424
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 503 TransientError says a retry might work, and 504 DeadlineExceeded is a
	// timeout. Only reads are replayed: a scan or a comment post may have gone
	// through, and a rescan is not idempotent in its quota use.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof VirustotalAPIError &&
			error.method === 'GET' &&
			(statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
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
