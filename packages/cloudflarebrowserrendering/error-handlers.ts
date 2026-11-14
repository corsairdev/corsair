import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CloudflareBrowserRenderingHTTPError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof CloudflareBrowserRenderingHTTPError) &&
				error.status === 429
			)
				return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('rate limit') ||
				message.includes('rate_limited') ||
				message.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof CloudflareBrowserRenderingHTTPError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof CloudflareBrowserRenderingHTTPError) &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('forbidden') ||
				message.includes('invalid api token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof CloudflareBrowserRenderingHTTPError) &&
				error.status === 400
			)
				return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('bad request') || message.includes('invalid request')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (
				(error instanceof ApiError ||
					error instanceof CloudflareBrowserRenderingHTTPError) &&
				error.status === 404
			)
				return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
