import type { CorsairErrorHandler } from 'corsair/core';
import { RevoltAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RevoltAPIError ? error.status : undefined;
}

/**
 * Revolt's error taxonomy, from its own `error.reason` values:
 *
 * - `Unauthorized` and `Forbidden` are a missing or insufficient token.
 * - `NotFound` is an unknown message, channel, server or user.
 * - `InvalidProperty`, `PayloadTooLarge` and `FailedValidation` are a refused
 *   body; a retry sends the same request.
 * - `RateLimited` is the per-bucket limit. The body carries `retry_after` in
 *   milliseconds, which the handler waits before retrying.
 * - `Blocked` is Revolt refusing an action it considers abusive. It also arrives
 *   as a 429, but no retry can clear it, so it is matched first.
 * - `5xx` is only replayed for a read.
 */
export const errorHandlers = {
	// A block answers 429 as well, so it must be matched before the rate limit.
	BLOCKED_ERROR: {
		match: (error: Error) =>
			error instanceof RevoltAPIError && error.isBlockedError,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RevoltAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof RevoltAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 413 ||
				(error instanceof RevoltAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof RevoltAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RevoltAPIError &&
			error.replayable &&
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

/**
 * Handlers match in key order and `DEFAULT` matches everything, so it stays
 * last. Caller keys go first: with `{ ...builtinRest, ...userRest }` a caller
 * handler keeps the builtin's position and a trailing `DEFAULT` claims the
 * error first.
 */
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
