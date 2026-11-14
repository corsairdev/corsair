import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GagelistAPIError, isReplayableGagelistError } from './client';

// An HTTP error from GageList is core's ApiError; GagelistAPIError is a
// request that got no answer.
function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// GageList answers 400, 401, 403 and 404, and its token endpoint answers
// `invalid_client`. Reference: https://gagelist.com/developer-resources/
export const errorHandlers = {
	// A 429 is a throughput limit. GageList publishes no Retry-After, so the
	// handler's own backoff is the only delay.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 is a refused or expired token, or `invalid_client` from the token
	// endpoint. The client clears its cached token on a 401, so a fresh one is
	// minted for the next attempt. One retry is worth it because that attempt
	// uses the new token rather than the rejected one.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_1s' as const,
		}),
	},
	// A client pair the token endpoint refused is a configuration mistake, and a
	// retry mints nothing new.
	CLIENT_CREDENTIALS_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError && error.body?.error === 'invalid_client',
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403 is a client that may read but not write this record.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422 are a field GageList refused, and 404 an unknown record.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A read is safe to replay, the POST list routes included. A write is not:
	// a 5xx after a gage create can arrive once the record exists, and a retry
	// would create a second one.
	SERVER_ERROR: {
		match: (error: Error) =>
			isReplayableGagelistError(error) && (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A dropped connection on a read never reached GageList. TIMEOUT sits first
	// because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			error instanceof GagelistAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries: error instanceof GagelistAPIError && error.replayable ? 1 : 0,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof GagelistAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: error instanceof GagelistAPIError && error.replayable ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so caller
// handlers go first, every builtin the caller did not name follows, and the
// fallback stays last. A plain spread would keep the caller's handler but the
// builtin's position, letting DEFAULT claim a status no builtin covers.
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
