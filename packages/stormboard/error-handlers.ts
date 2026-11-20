import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { StormboardAPIError } from './client';

// HTTP failures arrive as core's ApiError (rebuilt without the request body in
// client.ts); StormboardAPIError covers network failures and timeouts.
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof StormboardAPIError) {
		return error.status;
	}
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof StormboardAPIError) {
		return error.retryAfter;
	}
	return undefined;
}

function methodOf(error: Error): string | undefined {
	if (error instanceof ApiError) return error.request.method;
	if (error instanceof StormboardAPIError) return error.method;
	return undefined;
}

// Status taxonomy from https://api.stormboard.com/docs: 400 (bad request
// body), 401 (plan/access), 403 (auth failed), 404 (no such route), 429
// (rate limit with RateLimit-* headers). Auth failures are 403 here, not
// 401: "All requests that require authentication will return 403 Forbidden
// if your auth fails" (verified live).
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 403: a missing, invalid or plan-restricted credential.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 403 || statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400: malformed request body. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: creates (storms, ideas, invites) have no
	// documented idempotency contract, so a repeat send could duplicate.
	SERVER_ERROR: {
		match: (error: Error) =>
			methodOf(error) === 'GET' && (statusOf(error) ?? 0) >= 500,
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

// Handlers match in key order and DEFAULT matches everything. Caller keys
// come first so a caller handler for a status no builtin covers can run at
// all, builtins the caller did not name follow, and DEFAULT stays last even
// when the caller adds or overrides handlers.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
