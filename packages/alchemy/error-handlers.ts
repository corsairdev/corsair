import type { CorsairErrorHandler } from 'corsair/core';
import { AlchemyAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return error instanceof AlchemyAPIError ? error.status : undefined;
}

function getCode(error: Error): number | undefined {
	return error instanceof AlchemyAPIError ? error.code : undefined;
}

function getRetryAfter(error: Error): number | undefined {
	return error instanceof AlchemyAPIError ? error.retryAfter : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('exceeded capacity');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('forbidden') ||
				msg.includes('not enabled for this app')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 400) return true;
			const code = getCode(error);
			if (code === -32602 || code === -32600 || code === -32700) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid params') ||
				msg.includes('unsupported alchemy network')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
