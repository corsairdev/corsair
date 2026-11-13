import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { MistralAiAPIError } from './client';

/** The HTTP status carried by a Mistral or transport error, if it has one. */
function statusOf(error: Error): number | undefined {
	if (error instanceof MistralAiAPIError || error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

// Core takes the first handler whose match passes, so order matters and
// DEFAULT stays last (index.ts keeps it last when options add handlers).
export const errorHandlers = {
	// A 429 means the request was refused before it ran, so a retry cannot
	// bill twice. Mistral's spec documents no 429 or Retry-After; the header is
	// honoured only when a response carries it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		/** Retries up to 3 times, waiting `Retry-After` when Mistral sent it. */
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof MistralAiAPIError || error instanceof ApiError
					? error.retryAfter
					: undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 503: the service did not take the request. 408 on a read: nothing
	// changed. A write that timed out (408) may still have run and billed, so
	// it is not retried.
	TIMEOUT_ERROR: {
		/** True for a 503, and for a 408 only on a GET. */
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 503) return true;
			return (
				status === 408 &&
				error instanceof MistralAiAPIError &&
				error.method === 'GET'
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing, invalid or revoked key, or a key without access to the
	// resource: sending the same request again cannot succeed.
	AUTH_ERROR: {
		/** True for a 401 or 403. */
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422: Mistral named the fields it rejected (the message lists them);
	// the same input fails again.
	VALIDATION_ERROR: {
		match: (error: Error) => statusOf(error) === 422,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
