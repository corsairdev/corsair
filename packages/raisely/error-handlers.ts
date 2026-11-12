import type { CorsairErrorHandler } from 'corsair/core';
import { RaiselyAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RaiselyAPIError ? error.status : undefined;
}

/**
 * Raisely's error taxonomy, from the problem documents its routes declare:
 *
 * - `401` and `403` are a missing or insufficient token. On a public route an
 *   anonymous request is allowed, so a `403` here means the token was sent and
 *   refused, not that the record is protected.
 * - `404` and `410` mean the record is gone; `410` is a soft-deleted campaign or
 *   donation, which no retry recovers.
 * - `422` is a rejected record, and `errors` names every field at fault.
 * - `429` is the rate limit, documented with a `Retry-After`.
 * - `5xx` is only replayed for a call the endpoint declared replayable.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RaiselyAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof RaiselyAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 422 ||
				(error instanceof RaiselyAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof RaiselyAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RaiselyAPIError &&
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
