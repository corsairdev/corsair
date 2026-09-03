import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DocusignApiError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof DocusignApiError) return error.status;
	if (error instanceof ApiError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof DocusignApiError) return error.retryAfter;
	if (error instanceof ApiError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limit_exceeded') || msg.includes('429');
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterOf(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') || msg.includes('invalid_authentication')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 400 || status === 422) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('400') || msg.includes('422');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

export const docusignErrorHandlers = errorHandlers;
export default errorHandlers;
