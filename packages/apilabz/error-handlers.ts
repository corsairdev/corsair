import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ApiLabzAPIError } from './client';

function httpStatus(error: Error): number | undefined {
	if (error instanceof ApiLabzAPIError && error.status !== undefined) {
		return error.status;
	}
	if (error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

function retryAfterMs(error: Error): number | undefined {
	if (error instanceof ApiLabzAPIError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}
	if (error instanceof ApiError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (httpStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterMs(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (httpStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (httpStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('insufficient credits') ||
				msg.includes('access_denied')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
