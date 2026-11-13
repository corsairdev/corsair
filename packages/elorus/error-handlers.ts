import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ElorusAPIError } from './client';

// JSON calls fail with core's ApiError; binary downloads fail with ElorusAPIError. Both carry the HTTP status.
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof ElorusAPIError) {
		return error.status;
	}
	return undefined;
}

function hasStatus(error: Error): boolean {
	return error instanceof ApiError || error instanceof ElorusAPIError;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			hasStatus(error)
				? statusOf(error) === 429
				: error.message.includes('429') ||
					error.message.toLowerCase().includes('rate limit'),
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError || error instanceof ElorusAPIError
					? error.retryAfter
					: undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			hasStatus(error)
				? statusOf(error) === 401 || statusOf(error) === 403
				: error.message.toLowerCase().includes('unauthorized') ||
					error.message.toLowerCase().includes('forbidden'),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			hasStatus(error)
				? statusOf(error) === 400 || statusOf(error) === 422
				: error.message.toLowerCase().includes('bad request'),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			hasStatus(error)
				? statusOf(error) === 404
				: error.message.toLowerCase().includes('not found'),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
