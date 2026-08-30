import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Retry policy.
 *
 * Every handler returns `maxRetries: 0`, deliberately:
 *
 * 1. `corsair/http`'s `request()` already runs its own rate-limit retry loop
 *    and honours `Retry-After`, so a 429 has been retried before it reaches
 *    these handlers.
 * 2. The binder's retry path in `packages/corsair/core/endpoints/bind.ts`
 *    discards the value a successful retry returns and rethrows the original
 *    error, so a binder-level retry cannot turn a failure into a result — it
 *    only spends requests.
 *
 * All-Images.ai debits credits per image operation, so a retry that cannot
 * succeed is not merely wasted, it can be billed. The handlers still classify
 * failures and surface the provider's `Retry-After`.
 *
 * Error bodies are `{ statusCode, error, message }` where `message` is a string
 * array. https://developer.all-images.ai/all-images.ai-api/errors
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/** Insufficient credits for an operation that debits quota. */
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	/** Missing or malformed parameters; the body lists each failure. */
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
