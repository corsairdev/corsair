import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DadataruAPIError } from './client';

const errorStatus = (error: Error): number | undefined =>
	error instanceof ApiError || error instanceof DadataruAPIError
		? error.status
		: undefined;

const errorRetryAfterMs = (error: Error): number | undefined => {
	const retryAfter =
		error instanceof ApiError || error instanceof DadataruAPIError
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
			if (errorStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
