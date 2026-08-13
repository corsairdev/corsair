import type { CorsairErrorHandler } from 'corsair/core';
import type { AmcardsAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<AmcardsAPIError>).status;
}

/**
 * AMcards is a Django REST API. Status codes are the contract; message
 * heuristics only run when no status is present.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
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
			return msg.includes('500') || msg.includes('internal server error');
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
