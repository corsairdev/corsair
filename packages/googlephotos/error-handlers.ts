import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GooglePhotosTransportError } from './client';

function apiError(error: Error): ApiError | undefined {
	return error instanceof ApiError ? error : undefined;
}

function statusOf(error: Error): number | undefined {
	return apiError(error)?.status;
}

/**
 * Codes: https://developers.google.com/photos/library/guides/api-limits-quotas
 * (a 429 is either the 10,000-request daily project quota or a per-user rate
 * limit) and the upload guide's best practices (a 429 needs at least a 30
 * second delay; a 500 usually means parallel writes for one user).
 *
 * A 429 is retried with exponential backoff. The guide's 30 second floor is
 * longer than any strategy the core offers, so it is passed as the header
 * fallback: a real Retry-After still wins, and otherwise the first wait is 30s.
 *
 * A write is never replayed after a 5xx or a dropped connection: an upload can
 * have landed, and batchCreate has no idempotency key.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: apiError(error)?.retryAfter ?? 30_000,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 403 is a missing scope or no access to that album or item. The April 2025
	// change means a read can fail this way even with valid credentials.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 400 INVALID_ARGUMENT is a malformed request or a filter sent with an
	// albumId; 409 is a conflict, which a retry repeats.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 409;
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},

	// 5xx, including the 500 the upload guide attributes to parallel writes.
	// Reads only.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => ({
			maxRetries: apiError(error)?.request.method === 'GET' ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	// A dropped connection never reached Google. Reads only: an upload can have
	// been received, and its token would be lost.
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof GooglePhotosTransportError,
		handler: async (error: Error) => ({
			maxRetries:
				error instanceof GooglePhotosTransportError && error.isRead ? 2 : 0,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

/**
 * Handlers match in key order and core skips DEFAULT when looking for a named
 * match, so the caller's own handlers go first while DEFAULT stays last.
 */
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
