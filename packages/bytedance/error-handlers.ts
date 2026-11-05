import type { CorsairErrorHandler } from 'corsair/core';
import { BytedanceAPIError } from './client';

// https://docs.byteplus.com/en/docs/ModelArk/1299023
function statusOf(error: Error): number | undefined {
	return error instanceof BytedanceAPIError ? error.status : undefined;
}

function codeOf(error: Error): string {
	return error instanceof BytedanceAPIError ? (error.code ?? '') : '';
}

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' || statusOf(error) === 400,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// OperationDenied.ServiceNotOpen, overdue balance, access denied.
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// ModelNotOpen means the Seedance model is not activated for the account.
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	// Quota and spending-limit 429s do not clear by waiting.
	QUOTA_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 &&
			/^(QuotaExceeded|SetLimitExceeded|InflightBatchsizeExceeded)/.test(
				codeOf(error),
			),
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof BytedanceAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// A failed create may already have queued a billed task, so 5xx is not replayed.
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
