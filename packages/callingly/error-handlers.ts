import type { CorsairErrorHandler } from 'corsair/core';
import type { CallinglyAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<CallinglyAPIError>).status;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('too many requests')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 401 || status === 403;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('401') ||
				msg.includes('403') ||
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 404;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 400 || status === 422;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('400') ||
				msg.includes('422') ||
				msg.includes('bad request') ||
				msg.includes('validation') ||
				msg.includes('unprocessable')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status >= 500;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('500') ||
				msg.includes('internal server error') ||
				msg.includes('bad gateway') ||
				msg.includes('service unavailable')
			);
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
