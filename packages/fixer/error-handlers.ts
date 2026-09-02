import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FixerAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (
				error instanceof FixerAPIError &&
				(error.code === 104 ||
					error.code === 106 ||
					error.code === 429 ||
					error.status === 429)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('usage_limit_reached') ||
				msg.includes('quota')
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
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			if (
				error instanceof FixerAPIError &&
				(error.code === 101 ||
					error.code === 102 ||
					error.code === 105 ||
					error.status === 401 ||
					error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid_access_key') ||
				msg.includes('inactive_user') ||
				msg.includes('forbidden')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			if (
				error instanceof FixerAPIError &&
				(error.code === 404 || error.status === 404)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404_not_found');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			if (
				error instanceof FixerAPIError &&
				(error.code === 103 ||
					error.code === 201 ||
					error.code === 202 ||
					error.code === 301 ||
					error.code === 302 ||
					error.code === 401 ||
					error.code === 403 ||
					error.code === 501 ||
					error.code === 502 ||
					error.status === 400)
			) {
				return true;
			}
			return error.message.toLowerCase().includes('invalid');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
