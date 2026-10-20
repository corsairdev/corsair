import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FixerAPIError } from './client';

// https://fixer.io error codes: 101 missing or invalid access key,
// 102 inactive account, 104 monthly request quota reached.
const AUTH_CODES = new Set([101, 102]);
const QUOTA_CODE = 104;

function fixerCode(error: Error): number | undefined {
	return error instanceof FixerAPIError ? error.code : undefined;
}

function httpStatus(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => httpStatus(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	QUOTA_ERROR: {
		match: (error: Error) => fixerCode(error) === QUOTA_CODE,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = httpStatus(error);
			if (status === 401 || status === 403) return true;
			const code = fixerCode(error);
			return code !== undefined && AUTH_CODES.has(code);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => (httpStatus(error) ?? 0) >= 500,
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
