import type { CorsairErrorHandler } from 'corsair/core';
import { DataboxAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof DataboxAPIError ? error.status : undefined;
}

function codeOf(error: Error): string | undefined {
	return error instanceof DataboxAPIError ? error.code : undefined;
}

// Status codes and codes: the Errors section of
// https://developers.databox.com and each endpoint's page.
export const errorHandlers = {
	// Databox answers 429 with a Retry-After header (seconds). Limits are
	// 10,000 requests per hour per key, 10 per second, and 30 metric-data
	// calls per minute per account. The request was rejected, not processed,
	// so writes are retried too.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof DataboxAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Dataset modifications apply asynchronously; while one builds, many
	// endpoints answer 409 modification_in_progress with Retry-After, and
	// Databox says such a 409 does not count against the rate limit. The
	// request was not applied, so reads and writes retry. The docs' example
	// delay is 5 seconds when the header is missing.
	CONFLICT_IN_PROGRESS_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 409 && codeOf(error) === 'modification_in_progress',
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof DataboxAPIError
					? (error.retryAfter ?? 5000)
					: undefined,
			retryStrategy: 'linear_1s' as const,
		}),
	},
	// Any other 409, including modification_failed, which Databox marks
	// final: retrying sends the same request into the same state.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: a missing or invalid API key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the key's user is not allowed for this action, such as key
	// management on a non-Admin.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input (errors[].field names the field), 404 unknown id and
	// 405 wrong method. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 405
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A timed-out request may still have been applied, so only replay-safe
	// calls (reads and metrics.getData) retry.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof DataboxAPIError && error.isTimeout,
		handler: async (error: Error) =>
			error instanceof DataboxAPIError && error.replaySafe
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	// A 5xx may have applied a write before failing, so only replay-safe
	// calls retry.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof DataboxAPIError &&
			error.replaySafe &&
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
