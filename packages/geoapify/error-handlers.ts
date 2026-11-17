import type { CorsairErrorHandler } from 'corsair/core';
import { geoapifyErrorInfo } from './client';

/** HTTP failures arrive as core's ApiError, transport failures as GeoapifyAPIError. */
const info = geoapifyErrorInfo;

function statusOf(error: Error): number | undefined {
	return info(error)?.status;
}

/**
 * Every Geoapify API shares one error envelope and four statuses: 400, 401, 429
 * and 500. A live probe with a bad key answered 401 with
 * `{"statusCode":401,"error":"Unauthorized","message":"Invalid apiKey"}`.
 * Reference: https://apidoc.geoapify.com/
 */
export const errorHandlers = {
	// 429 covers both a burst and an exhausted quota. A used-up quota only fails
	// again until it resets, so it gets no retry.
	QUOTA_EXCEEDED: {
		match: (error: Error) => info(error)?.isQuotaExceeded === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A burst over the per-second limit; honour Retry-After when it is sent.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => info(error)?.isRateLimit === true,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: info(error)?.retryAfter,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing or invalid key. A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => info(error)?.isAuthError === true,
		handler: async () => ({ maxRetries: 0 }),
	},
	// A parameter the gateway refused, such as a limit above the maximum, or a
	// value a zod schema refused before the request was made.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// An unknown route or place.
	NOT_FOUND: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Every call is a GET or a computation that changes nothing at Geoapify, so
	// a 5xx is safe to replay.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) => info(error)?.timedOut === true,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => info(error)?.transport === true,
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
