import type { CorsairErrorHandler } from 'corsair/core';
import { TinypngAPIError } from './client';

function tinifyStatus(error: Error): number | undefined {
	return error instanceof TinypngAPIError && !error.compressed
		? error.status
		: undefined;
}

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		// Tinify rejects a rate-limited request before compressing, so a retry
		// is not billed twice.
		match: (error: Error) => tinifyStatus(error) === 429,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => tinifyStatus(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		// Tinify documents 5xx as temporary and its own clients retry once.
		match: (error: Error) => (tinifyStatus(error) ?? 0) >= 500,
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
