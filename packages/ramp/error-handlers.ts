import type { CorsairErrorHandler } from 'corsair/core';
import { RAMP_RATE_LIMIT_COOLDOWN_MS, RampAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RampAPIError ? error.status : undefined;
}

/**
 * Ramp's error taxonomy, per https://docs.ramp.com/developer-api/v1/authorization
 * under "API errors" and the rate-limiting guide:
 *
 * - A rejected or expired token is documented as `401`, but the live API answers
 *   **404** with `error_v2.error_code: 'DEVELOPER_7002'`. The `AUTH_ERROR`
 *   matcher reads the code so a bad key is not mistaken for a missing record.
 * - `403` is a missing scope, or a plan feature the business lacks.
 *   `DEVELOPER_7100` is the explicit read-only-token refusal.
 * - `429` is the documented throughput limit: 200 requests per 10 seconds per
 *   source IP, then a 60 second block. Ramp asks callers to honor
 *   `Retry-After` and otherwise allow for that cooldown.
 * - `504` is a gateway timeout, which Ramp says to retry for reads only. A write
 *   that times out may have landed.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof RampAPIError && error.retryAfter !== undefined
					? error.retryAfter
					: RAMP_RATE_LIMIT_COOLDOWN_MS,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// The invalid-token 404 and a real 401 both land here.
	AUTH_ERROR: {
		match: (error: Error) => error instanceof RampAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof RampAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 404 that is not the invalid-token code: an unknown route or record.
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof RampAPIError && error.isNotFound,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Ramp: retry a 504 with backoff, and for a write check whether it landed
	// first. Only reads are replayed here; a PATCH or POST may have applied.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RampAPIError &&
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
