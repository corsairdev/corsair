import type { CorsairErrorHandler } from 'corsair/core';
import { SegmentAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof SegmentAPIError ? error.status : undefined;
}

// Segment checks auth before routing: with an invalid token every path
// (including paths that do not exist) answers 403 forbidden, and only a
// missing Authorization header gets 401. A 403 is therefore a bad or wrong-scoped
// token, not a missing resource.
export const errorHandlers = {
	// Token-level and per-endpoint limits both answer 429. Token-level 429s
	// always carry Retry-After; per-endpoint ones fall back to the body's
	// msBeforeNext, which the client reads into the same field.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof SegmentAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 403 with an invalid token and 401 with a missing header are both auth
	// problems; no retry can fix either.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 missing id: a retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Segment grants about 3600 requests per short window and does not
	// document 5xx as transient, and writes here (deletes, regulation creates)
	// are not safe to replay blind. Only reads get a bounded retry.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof SegmentAPIError &&
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
