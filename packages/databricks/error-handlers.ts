import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DatabricksAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof DatabricksAPIError) {
				if (error.status === 429) return true;
				const msg = error.message.toLowerCase();
				return (
					msg.includes('429') ||
					msg.includes('request_limit_exceeded') ||
					msg.includes('too_many_requests')
				);
			}
			return false;
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof DatabricksAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof DatabricksAPIError) {
				if (error.status === 401) return true;
				const msg = error.message.toLowerCase();
				return (
					msg.includes('401') ||
					msg.includes('invalid_access_token') ||
					msg.includes('unauthenticated')
				);
			}
			return false;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
