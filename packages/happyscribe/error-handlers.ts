import type { CorsairErrorHandler } from 'corsair/core';
import { HappyScribeAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof HappyScribeAPIError ? error.status : undefined;
}

function replaySafeOf(error: Error): boolean {
	return error instanceof HappyScribeAPIError && error.replaySafe === true;
}

// Status codes: https://dev.happyscribe.com/sections/general/#errors
export const errorHandlers = {
	// 429 carries `retry_in_seconds` in the body (per-user, 200 req/hour on
	// transcription creation) or, on the Meeting API, a `Retry-After` header.
	// Wait exactly what the API asked for; with neither, the backoff takes
	// over.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof HappyScribeAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof HappyScribeAPIError
					? error.retryInSeconds !== undefined
						? error.retryInSeconds * 1000
						: undefined
					: undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: missing or wrong API token.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 403: the token may not act on this organization or resource.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 404 unknown resource or non-enrolled organization
	// (Intelligence API). A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 410: deleted resource; 422: unprocessable (e.g. a language the plan
	// does not cover). Neither can succeed on retry.
	GONE_ERROR: {
		match: (error: Error) => statusOf(error) === 410 || statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx: only reads marked replaySafe in client.ts are retried. Creating a
	// transcription or an order may have gone through.
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
