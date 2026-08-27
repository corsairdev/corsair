import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BartAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof BartAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limit') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof BartAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof BartAPIError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid key') ||
				msg.includes('authentication')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			if (error instanceof BartAPIError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('does not exist');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			if (error instanceof BartAPIError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid station') ||
				msg.includes('invalid origin') ||
				msg.includes('invalid destination') ||
				msg.includes('invalid route')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error?: Error) => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
