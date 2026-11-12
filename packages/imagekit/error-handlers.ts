import type { CorsairErrorHandler } from 'corsair/core';
import { ImageKitAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ImageKitAPIError ? error.status : undefined;
}

function replaySafeOf(error: Error): boolean {
	return error instanceof ImageKitAPIError && error.replaySafe === true;
}

// Status codes and rate-limit headers: https://imagekit.io/docs/api-overview
export const errorHandlers = {
	// 429 carries X-RateLimit-Reset in milliseconds (a duration, not an epoch
	// timestamp), a header core cannot read. Bursts clear fast, so the retry
	// waits the documented burst scale: 1s, then 2s, 4s.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			// A fixed delay would disable the backoff below (core gives
			// headersRetryAfterMs precedence), so set it only when a real
			// header arrived; ImageKit sends none and bursts clear on the
			// documented 1s, 2s, 4s scale.
			headersRetryAfterMs:
				error instanceof ImageKitAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: missing or wrong private key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: disabled account, or an upload past the storage or upload limit.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 unknown file, folder, version or job. A retry
	// sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads marked replaySafe in client.ts are retried. An upload,
	// copy or delete may have gone through, and ImageKit documents no
	// idempotency for writes.
	SERVER_ERROR: {
		match: (error: Error) =>
			replaySafeOf(error) && (statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}
