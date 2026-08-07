import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	FacebookAPIError,
	isFacebookAuthError,
	isFacebookRateLimitError,
} from './client';

function retryAfterMsOf(error: Error): number | undefined {
	if (error instanceof FacebookAPIError && error.retryAfter !== undefined) {
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
			if (isFacebookRateLimitError(error)) return true;
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof FacebookAPIError && error.status === 429) {
				return true;
			}
			return error.message.toLowerCase().includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterMsOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (isFacebookAuthError(error)) return true;
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid oauth') || msg.includes('session has expired')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof FacebookAPIError) {
				return error.code === 10 || error.code === 200 || error.code === 294;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('permission') || msg.includes('not authorized');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
