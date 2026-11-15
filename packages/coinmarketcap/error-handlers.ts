import type { CorsairErrorHandler } from 'corsair/core';
import { CoinMarketCapAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof CoinMarketCapAPIError ? error.status : undefined;
}

function codeOf(error: Error): number | undefined {
	return error instanceof CoinMarketCapAPIError ? error.code : undefined;
}

// Status codes and error codes:
// https://coinmarketcap.com/api/documentation/guides/errors-and-rate-limits
export const errorHandlers = {
	// 1001 on a 401, 1002 when the header is absent, 1007 for a disabled key.
	// Every one needs a new key, and on a 401 CoinMarketCap has already refused
	// the call, so a replay cannot succeed.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 ||
			codeOf(error) === 1001 ||
			codeOf(error) === 1002 ||
			codeOf(error) === 1007,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: 1005 means the route needs a key this call did not get, and 1006
	// means the plan does not cover it. Neither changes on a retry.
	PERMISSION_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 403 ||
			codeOf(error) === 1005 ||
			codeOf(error) === 1006,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402: 1003 is an unactivated key and 1004 an expired subscription. Both are
	// billing states, so waiting does not help.
	BILLING_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 402 ||
			codeOf(error) === 1003 ||
			codeOf(error) === 1004,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 1009 (daily), 1010 (monthly) and 1022 (anonymous allowance) are plan
	// limits expressed as a 429, and retrying one burns attempts for a window
	// that is at least a day wide. This must sit before RATE_LIMIT_ERROR,
	// because core runs the first handler whose match passes.
	QUOTA_ERROR: {
		match: (error: Error) =>
			codeOf(error) === 1009 ||
			codeOf(error) === 1010 ||
			codeOf(error) === 1022,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429 with 1008 (minute limit) or 1011 (IP limit), and any 429 whose body
	// carried no code, which is what a gateway answers. CoinMarketCap documents
	// a 60 second window that resets every UTC minute, so that is the fallback
	// when no Retry-After arrives; a real header still overrides it. Core applies
	// headersRetryAfterMs verbatim on every attempt, and no built-in strategy
	// can express 60 seconds, which is why the window lives here.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs:
				(error instanceof CoinMarketCapAPIError
					? error.retryAfter
					: undefined) ?? 60_000,
		}),
	},
	// 400 covers a bad parameter and an unknown identifier, and every route in
	// this plugin is a read, so a replay sends the same thing and fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// CoinMarketCap says to retry a 500 with backoff. Both routes here are
	// reads, so a replay is safe.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
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

// Handlers match in key order and DEFAULT matches everything, so it stays last
// even when the caller adds or overrides handlers. Caller keys come first, so a
// caller handler for a status no builtin covers is the one that runs.
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
