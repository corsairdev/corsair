import type { CorsairErrorHandler } from 'corsair/core';
import { RollbarAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RollbarAPIError ? error.status : undefined;
}

/**
 * Rollbar's error taxonomy:
 *
 * - `401` is a missing or rejected token, and the live body is
 *   `{ err: 1, message: 'access token required' }`. A token is scoped, so a
 *   `403` is the same key used for a project or scope it does not cover.
 * - `400` is a rejected body or a bad filter.
 * - `404` is an unknown item, occurrence, project or deploy.
 * - `429` is the plan's rate limit. The message names the wait rather than a
 *   header, so the handler backs off on its own.
 * - `5xx` is only replayed for a read.
 *
 * A failure can also arrive as a **200 with `err` non-zero**, which the client
 * turns into an error with no status. That lands on `DEFAULT`, because no retry
 * can help a body Rollbar described as failed.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RollbarAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof RollbarAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 422 ||
				(error instanceof RollbarAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof RollbarAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RollbarAPIError &&
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
