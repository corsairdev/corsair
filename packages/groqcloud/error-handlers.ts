import type { CorsairErrorHandler } from 'corsair/core';
import { GroqcloudAPIError } from './client';

/**
 * Match on the transport status carried by `GroqcloudAPIError`, not on message
 * text: corsair throws a 429 with the message "Too Many Requests", which
 * contains neither "429" nor "rate_limited".
 */
function asApiError(error: Error): GroqcloudAPIError | undefined {
	return error instanceof GroqcloudAPIError ? error : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => asApiError(error)?.status === 429,
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: asApiError(error)?.retryAfter,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = asApiError(error)?.status;
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
