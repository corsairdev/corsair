import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { LeexiAPIError } from './client';

const errorStatus = (error: Error): number | undefined =>
	error instanceof ApiError || error instanceof LeexiAPIError
		? error.status
		: undefined;

const errorRetryAfterMs = (error: Error): number | undefined => {
	const retryAfter =
		error instanceof ApiError || error instanceof LeexiAPIError
			? error.retryAfter
			: undefined;
	return typeof retryAfter === 'number' ? retryAfter : undefined;
};

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (errorStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error) => {
			return { maxRetries: 5, headersRetryAfterMs: errorRetryAfterMs(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = errorStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => {
			if (errorStatus(error) === 402) return true;
			return error.message.toLowerCase().includes('payment required');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
