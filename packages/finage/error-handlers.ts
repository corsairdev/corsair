import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FinageAPIError } from './client';

type StatusError = ApiError | FinageAPIError;

const isStatusError = (error: Error): error is StatusError =>
	error instanceof ApiError || error instanceof FinageAPIError;

// Single retry owner for 429s: the transport stays single-attempt (see
// client.ts) and only this policy retries, honoring Retry-After.
function retryStrategyFor(error: Error): RetryStrategy {
	if (isStatusError(error) && error.status === 429) {
		return { maxRetries: 5, headersRetryAfterMs: error.retryAfter };
	}
	return { maxRetries: 0 };
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => isStatusError(error) && error.status === 429,
		handler: async (error: Error) => retryStrategyFor(error),
	},
	AUTH_ERROR: {
		match: (error: Error) => isStatusError(error) && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// handleCorsairError picks the first matching key in insertion order, and
	// core merges root handlers before plugin handlers. A root-level DEFAULT
	// keeps its position ahead of RATE_LIMIT_ERROR, so this handler has to apply
	// the same retry policy; otherwise that root DEFAULT shadows the 429 case.
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => retryStrategyFor(error),
	},
} satisfies CorsairErrorHandler;
