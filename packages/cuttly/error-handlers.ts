import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CuttlyAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof CuttlyAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('too many requests') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof CuttlyAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (
				error instanceof CuttlyAPIError &&
				(error.status === 401 || error.code === 4)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key') ||
				msg.includes('rejected the api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			// Cutt.ly provider codes: 0 unknown stats link, 2 invalid URL/save
			// failure, 3 taken/missing, 5 validation, 6 blocked domain, 8 quota.
			// Code 4 (invalid key) is AUTH_ERROR, so it is excluded here.
			if (
				error instanceof CuttlyAPIError &&
				[0, 2, 3, 5, 6, 8].includes(error.code ?? -1)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid') ||
				msg.includes('already in use') ||
				msg.includes('already taken') ||
				msg.includes('blocked') ||
				msg.includes('limit reached') ||
				msg.includes('could not save') ||
				msg.includes('does not exist')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
