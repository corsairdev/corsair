import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	FACEBOOK_RATE_LIMIT_ERROR_CODES,
	FacebookAPIError,
	isFacebookRateLimitError,
} from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (isFacebookRateLimitError(error)) return true;
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof FacebookAPIError && error.code !== undefined) {
				return FACEBOOK_RATE_LIMIT_ERROR_CODES.has(error.code);
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('too many calls') ||
				msg.includes('request limit') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof FacebookAPIError && error.code === 190) return true;
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid oauth') ||
				msg.includes('access token') ||
				msg.includes('session has expired')
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
