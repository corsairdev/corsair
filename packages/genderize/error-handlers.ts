import type { CorsairErrorHandler } from 'corsair/core';
import { genderizeErrorInfo } from './client';

// Genderize documents 401, 402, 422 and 429, and carries a JSON `error` string
// on each. Reference: https://genderize.io/documentation/api
export const errorHandlers = {
	// The monthly quota (or the keyless per-IP allowance) and the short-term
	// throttle both answer 429. `Request limit reached` is the exhausted quota:
	// it lasts until the window resets, hours away, so a retry only fails again.
	// Anything else is the throttle, which honours Retry-After when Genderize
	// sends one and otherwise backs off.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => genderizeErrorInfo(error).isRateLimit,
		handler: async (error: Error) => {
			const info = genderizeErrorInfo(error);
			if (info.reason === 'Request limit reached') {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				headersRetryAfterMs: info.retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	// A key the account refused. Retrying sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => genderizeErrorInfo(error).isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 402 is a paused, expired or unpaid subscription. It sits after AUTH_ERROR
	// because the key itself is valid, and no retry fixes a billing state.
	SUBSCRIPTION_ERROR: {
		match: (error: Error) => genderizeErrorInfo(error).isSubscriptionError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 is a missing, empty or malformed name. A retry sends the same name.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const { status } = genderizeErrorInfo(error);
			return error.name === 'ZodError' || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A 5xx on a read never changed anything, so it is safe to replay.
	SERVER_ERROR: {
		match: (error: Error) => (genderizeErrorInfo(error).status ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A timeout is also a transport failure, so it is matched first.
	TIMEOUT_ERROR: {
		match: (error: Error) => genderizeErrorInfo(error).timedOut,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'linear_2s' as const,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => genderizeErrorInfo(error).transport,
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
