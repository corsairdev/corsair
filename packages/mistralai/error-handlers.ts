import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { MistralAiAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof MistralAiAPIError || error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof MistralAiAPIError || error instanceof ApiError) {
		return error.retryAfter;
	}
	return undefined;
}

// Core takes the first handler whose match passes, so order matters.
export const errorHandlers = {
	// Honour Retry-After when the response carries one; otherwise back off.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 408 (request timeout) and 503 (service unavailable) are transient.
	TRANSIENT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 408 || status === 503;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A missing, invalid or revoked key, or a key without access to the
	// resource: sending the same request again cannot succeed.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
