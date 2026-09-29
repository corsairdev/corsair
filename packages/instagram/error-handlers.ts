import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { InstagramAPIError } from './client';

const RATE_LIMIT_CODES = new Set([4, 17, 32, 613]);

function retryAfterMsOf(error: Error): number | undefined {
	if (error instanceof ApiError && error.retryAfter !== undefined) {
		return error.retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (
				error instanceof InstagramAPIError &&
				error.code !== undefined &&
				RATE_LIMIT_CODES.has(error.code)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterMsOf(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof InstagramAPIError && error.code === 190) return true;
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
			if (error instanceof InstagramAPIError) {
				return error.code === 10 || error.code === 200 || error.code === 294;
			}
			if (error instanceof ApiError && error.status === 403) return true;
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
