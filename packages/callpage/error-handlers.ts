import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	return 'status' in error && typeof error.status === 'number'
		? error.status
		: undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	return 'retryAfter' in error && typeof error.retryAfter === 'number'
		? error.retryAfter
		: undefined;
}

// Only GET is safe to re-run: a rate-limited POST may already have been applied.
function isReadRequest(error: Error): boolean {
	return 'method' in error && error.method === 'GET';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate') || msg.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: isReadRequest(error) ? 5 : 0,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
