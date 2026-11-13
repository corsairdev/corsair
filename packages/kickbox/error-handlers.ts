import type { CorsairErrorHandler } from 'corsair/core';
import { KickboxAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof KickboxAPIError ? error.status : undefined;
}

// Kickbox answers 400, 401, 403, 429, 500 and 503, and puts its own code in the
// body. Reference: https://docs.kickbox.com/docs/single-verification-api
export const errorHandlers = {
	// The account has run out of verification credits. Kickbox reports it as a
	// 200 with `success: false` and `code: INSUFFICIENT_BALANCE`, which the
	// client turns into an error, so matching the code is the only way to catch
	// it. It sits before RATE_LIMIT_ERROR because a spent balance never clears.
	QUOTA_ERROR: {
		match: (error: Error) =>
			error instanceof KickboxAPIError && error.isQuotaError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 429 is a throughput limit. Kickbox publishes no Retry-After, so the
	// handler's own backoff is the only delay.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof KickboxAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				error instanceof KickboxAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A refused or missing key. Regenerating one in the dashboard kills the old
	// key, so a 403 usually means it was replaced.
	// Kickbox can also send the FORBIDDEN code on a 200, which isAuthError covers.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof KickboxAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 and 422 are an address or timeout Kickbox will not accept. A retry
	// sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 500 and 503 are Kickbox's own failures, answered without a verdict. Both
	// operations here are GETs, so replaying one cannot change anything at Kickbox.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof KickboxAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout or a dropped connection does not prove the request never reached
	// Kickbox. The free disposable check is replayed; a paid verification is not,
	// because its answer may have been lost after Kickbox charged a credit for it.
	// TIMEOUT sits first because a timeout is also a transport failure.
	TIMEOUT_ERROR: {
		match: (error: Error) => error instanceof KickboxAPIError && error.timedOut,
		handler: async (error: Error) => ({
			maxRetries: error instanceof KickboxAPIError && error.paid ? 0 : 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof KickboxAPIError && error.transport,
		handler: async (error: Error) => ({
			maxRetries: error instanceof KickboxAPIError && error.paid ? 0 : 2,
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
