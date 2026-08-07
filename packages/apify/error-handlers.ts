import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function messageOf(error: Error): string {
	if (error instanceof ApiError) {
		const body = error.body as
			| { error?: { type?: string; message?: string } }
			| undefined;
		return [
			body?.error?.type,
			body?.error?.message,
			error.message,
			error.statusText,
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();
	}

	return error.message.toLowerCase();
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 429
				: messageOf(error).includes('rate-limit'),
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff_jitter',
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 401
				: messageOf(error).includes('token') ||
					messageOf(error).includes('unauthorized'),
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 403
				: messageOf(error).includes('permission') ||
					messageOf(error).includes('forbidden'),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 404
				: messageOf(error).includes('not found'),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 400
				: messageOf(error).includes('invalid'),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
