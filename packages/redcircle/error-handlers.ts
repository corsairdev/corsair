import type { CorsairErrorHandler } from 'corsair/core';
import { RedcircleAPIError } from './client';

const MAX_INCIDENT_RETRY_DELAY_MS = 30_000;

function statusOf(error: Error): number | undefined {
	return error instanceof RedcircleAPIError ? error.status : undefined;
}

/**
 * RedCircle's error taxonomy, from its response-codes page:
 *
 * - `401` is an invalid `api_key`. The demo key also answers 401 for the routes
 *   it does not cover, so the message is worth reading rather than the code.
 * - `402` is the account out of credits or a payment problem; no retry fixes it,
 *   and it is matched before the rate-limit handler because both look transient.
 * - `400` is an invalid parameter, and the body names the valid `type` values.
 * - `404` is a wrong path or verb.
 * - `429` is the plan's rate limit.
 * - `503` is a parsing incident. RedCircle says the request was **not charged**
 *   and supplies `retry_after` in the body, so it is the one failure that is
 *   always safe to repeat, for reads and writes alike.
 * - `500` is replayed only for a read.
 */
export const errorHandlers = {
	// A spent balance answers 402, not 429, and never recovers on a retry.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof RedcircleAPIError && error.isQuotaError,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RedcircleAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A parsing incident is explicitly not charged, so it is always replayable.
	INCIDENT_ERROR: {
		match: (error: Error) =>
			error instanceof RedcircleAPIError && error.isIncident,
		handler: async (error: Error) => ({
			// Surface long incidents instead of keeping a call open or retrying early.
			maxRetries:
				error instanceof RedcircleAPIError &&
				error.retryAfter !== undefined &&
				(!Number.isFinite(error.retryAfter) ||
					error.retryAfter > MAX_INCIDENT_RETRY_DELAY_MS)
					? 0
					: 2,
			headersRetryAfterMs:
				error instanceof RedcircleAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof RedcircleAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				(error instanceof RedcircleAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof RedcircleAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RedcircleAPIError &&
			error.replayable &&
			(error.status === undefined || error.status >= 500),
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
