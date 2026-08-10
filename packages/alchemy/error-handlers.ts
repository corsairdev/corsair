import type { CorsairErrorHandler } from 'corsair/core';
import { AlchemyAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof AlchemyAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('429') ||
				msg.includes('exceeded capacity')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof AlchemyAPIError && error.status === 429) {
				// We don't have direct access to headers unless we parse them in ApiError,
				// but Corsair's core handles generic retryAfter if it exists.
				retryAfterMs = undefined;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof AlchemyAPIError) {
				if (error.status === 401 || error.status === 403) return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('forbidden') ||
				msg.includes('401') ||
				msg.includes('403')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof AlchemyAPIError && error.status === 404) return true;
			return error.message.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof AlchemyAPIError) {
				if (error.status === 400) return true;
				if (
					error.code === -32602 ||
					error.code === -32600 ||
					error.code === -32700
				) {
					return true; // JSON-RPC invalid params / request
				}
			}
			return error.message.includes('400');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
