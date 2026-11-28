import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { RAGIE_REPLAY_SAFE_POSTS } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** Reads and the read-only POST /retrievals may be sent again after a 5xx. */
function isReplaySafe(error: Error): boolean {
	if (!(error instanceof ApiError)) return false;
	return (
		error.request.method === 'GET' ||
		(error.request.method === 'POST' &&
			RAGIE_REPLAY_SAFE_POSTS.has(error.request.url))
	);
}

export const errorHandlers = {
	// 402: the plan's page or usage limit is spent; retrying cannot help.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// The client makes one attempt (maxRetries 0 in its rate limit config),
	// so this handler owns 429 retries. Ragie refuses a rate-limited request
	// before running it, so a write is safe to resend (R8).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
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
	// A 5xx is replayed only for reads; a create or update may have landed.
	SERVER_ERROR: {
		match: (error: Error) =>
			isReplaySafe(error) && (statusOf(error) ?? 0) >= 500,
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
