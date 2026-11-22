import type { CorsairErrorHandler } from 'corsair/core';
import { StannpAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof StannpAPIError ? error.status : undefined;
}

// Documented statuses: 200, 401, 404, 409 (idempotent replay) and 500, plus
// 429 for the documented 300 requests/minute limit.
// https://www.stannp.com/us/direct-mail-api/guide
export const errorHandlers = {
	// A rate-limited request never ran, so replaying it is safe. The window
	// state arrives on X-RateLimit-Reset, seconds until reset; the client
	// reads it into retryAfter and a real Retry-After would override it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof StannpAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong or missing API key ("You do not have authorisation").
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 409: an idempotent replay (the body is the ORIGINAL success envelope,
	// reachable on error.body) or a genuine conflict. Neither retries.
	CONFLICT_ERROR: {
		match: (error: Error) => statusOf(error) === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 unknown resource. A retry sends the same
	// request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Stannp documents 500 as "something went wrong at our end". Only reads
	// are replayed: a create can have gone through and taken payment, so a
	// repeat send could post twice. Idempotency-keyed calls stay unreplayed
	// here too; the caller can retry them deliberately with the same key.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof StannpAPIError &&
			error.method === 'GET' &&
			(error.status ?? 0) >= 500,
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
