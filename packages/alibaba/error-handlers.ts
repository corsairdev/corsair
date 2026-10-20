import type { CorsairErrorHandler } from 'corsair/core';
import { AlibabaAPIError } from './client';

// https://www.alibabacloud.com/help/en/model-studio/error-code
function statusOf(error: Error): number | undefined {
	return error instanceof AlibabaAPIError ? error.status : undefined;
}

export const errorHandlers = {
	// InvalidParameter, DataInspectionFailed (content moderation), Arrearage.
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// AccessDenied: the model or workspace is not available to this key.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Throttling, Throttling.RateQuota, Throttling.BurstRate: wait and retry.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof AlibabaAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A failed submit can still have created a billed task, so 5xx is not replayed.
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
