import type { CorsairErrorHandler } from 'corsair/core';
import { RadarAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RadarAPIError ? error.status : undefined;
}

/**
 * Radar's error taxonomy. It answers a real HTTP status and repeats it in
 * `meta.code`, so the handlers key on the status:
 *
 * - `401` is a missing or invalid key; the live body reads
 *   `Unauthorized. Publishable API key required.` when a secret route is called
 *   without one.
 * - `402` is the organisation disabled or the usage quota exhausted. No retry
 *   fixes either, so it is matched first and stops immediately.
 * - `403` is insufficient permission for the route.
 * - `451` is a country blocklist refusal, which no retry clears.
 * - `429` covers the documented per-second limit *and* selective throttling,
 *   where Radar says no state changed, so a read is safe to repeat.
 * - `5xx` is only replayed for a call the endpoint declared replayable.
 */
export const errorHandlers = {
	// A spent quota looks like a transient failure but never recovers on retry.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof RadarAPIError && error.isQuotaError,
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof RadarAPIError &&
			error.status === 429 &&
			error.replayable,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RadarAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof RadarAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A country blocklist is a legal refusal, not a bug in the request.
	LEGAL_ERROR: {
		match: (error: Error) =>
			error instanceof RadarAPIError && error.isLegalError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 409 ||
				(error instanceof RadarAPIError && error.isValidationError)
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof RadarAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RadarAPIError &&
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
