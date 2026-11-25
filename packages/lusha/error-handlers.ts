import type { CorsairErrorHandler } from 'corsair/core';
import { LushaAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof LushaAPIError ? error.status : undefined;
}

/**
 * Handler keys are ordered so the most specific match wins: core takes the
 * first key whose `match` passes, so `INSUFFICIENT_BALANCE_ERROR` must sit
 * before anything broad, and `DEFAULT` matches everything and stays last.
 *
 * Status codes: https://docs.lusha.com/docs/errors - the docs say never retry
 * 400, 401, 402 or 403, retry 429 and 5xx.
 */
export const errorHandlers = {
	// 402 "Insufficient credits for this operation": the account pool is empty.
	// Retrying burns three attempts on a permanent failure, so this is fatal
	// and comes before any generic or rate-limit handler. The message is also
	// matched in case the status ever differs.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) =>
			error instanceof LushaAPIError && error.outOfCredits,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, per account (25 requests/second default; account.usage 5/minute).
	// Lusha sends no Retry-After header, so the delay comes from the strategy.
	// The docs endorse retrying a 429; a "trial account limit" message can also
	// arrive inside one, and a bounded retry keeps that from looping forever.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof LushaAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof LushaAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: missing or bad key, or the key was suspended by an admin.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof LushaAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the plan does not cover the request, e.g. "excludeDnc is not
	// available on your current plan". A different key cannot fix it.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof LushaAPIError && error.isPermissionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 bad request, 404 unknown record or job id (stop polling), 409
	// duplicate table name, 451 legal block. Repeating sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 409 ||
				status === 451
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 408 (or a TimeoutError cause). The request reached Lusha, so a metered
	// call is not replayed (see client.ts safeToReplay).
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			(error instanceof LushaAPIError && error.status === 408) ||
			error.name === 'TimeoutError',
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof LushaAPIError && error.safeToReplay ? 1 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 500, 502, 503 and 499; the docs say to retry a 500. A 503 on the job
	// poll means the job store is unreachable and a retry is expected. Metered
	// calls set safeToReplay false on a 5xx (client.ts), so only free reads
	// (account.usage, the job poll) actually retry here.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof LushaAPIError &&
			error.safeToReplay &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Transport failures (reset, DNS, abort) never reached Lusha, so the client
	// marks them safeToReplay and a bounded retry is allowed even on metered
	// calls. This must sit before DEFAULT or a dropped connection on a read
	// never retries.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof LushaAPIError && error.status === undefined,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof LushaAPIError && error.safeToReplay ? 1 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. Caller keys come
// first so a caller handler for a status no builtin covers actually runs.
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
