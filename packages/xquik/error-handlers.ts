import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { XquikAPIError } from './client';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof XquikAPIError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof XquikAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const message = error.message.toLowerCase();
			return (
				status === 401 ||
				message.includes('unauthorized') ||
				message.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED: {
		match: (error: Error) => {
			const status = statusOf(error);
			const message = error.message.toLowerCase();
			return status === 402 || message.includes('insufficient_credits');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const message = error.message.toLowerCase();
			return (
				status === 403 ||
				message.includes('account_needs_reauth') ||
				message.includes('account_restricted')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			const message = error.message.toLowerCase();
			return (
				status === 429 ||
				message.includes('rate_limited') ||
				message.includes('too many requests')
			);
		},
		handler: async (error: Error) => ({
			headersRetryAfterMs: retryAfterOf(error),
			maxRetries: 5,
		}),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 424 || status === 502 || status === 503;
		},
		handler: async (error: Error) => ({
			headersRetryAfterMs: retryAfterOf(error),
			maxRetries: 3,
		}),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
