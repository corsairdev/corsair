import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isOutOfCredits, isReplayable } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/**
 * Handler keys are ordered so the most specific match wins: core takes the
 * first key whose `match` passes, so OUT_OF_CREDITS sits before anything
 * broad, and DEFAULT matches everything and stays last.
 *
 * Status codes: https://docs.lusha.com/docs/errors (400 bad request, 401 bad
 * key, 402 out of credits, 403 plan restriction, 404 unknown id or job, 409
 * duplicate table name, 429 rate limited, 451 legal block, 5xx server).
 */
export const errorHandlers = {
	// 402 "Insufficient credits for this operation": the account pool is empty.
	OUT_OF_CREDITS_ERROR: {
		match: (error: Error) => isOutOfCredits(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429, per account (25 requests/second default; account.usage 5/minute).
	// Core's request() already retried it three times with backoff, so this
	// does not retry again (R8).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 401: missing or bad key, or the key was suspended by an admin.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the plan does not cover the request, e.g. "excludeDnc is not
	// available on your current plan". A retry cannot fix it.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 404 (an id or job that does not exist: stop polling), 409, 422,
	// 451, or our own input validation. Repeating sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				(status !== undefined && [400, 404, 409, 422, 451].includes(status))
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx and 408: retried only for free reads (client.ts marks them). Every
	// other call charges credits or changes data on each run, and the first
	// attempt may already have landed (R8).
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && (status >= 500 || status === 408);
		},
		handler: async (error: Error) => ({
			maxRetries: isReplayable(error) ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Transport failures (reset, DNS, timeout): same rule as a 5xx. The
	// request may have reached Lusha before the connection dropped.
	NETWORK_ERROR: {
		match: (error: Error) =>
			!(error instanceof ApiError) && error.name !== 'ZodError',
		handler: async (error: Error) => ({
			maxRetries: isReplayable(error) ? 2 : 0,
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
