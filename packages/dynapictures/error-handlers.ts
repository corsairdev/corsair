import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { DynapicturesAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError && typeof error.status === 'number') {
		return error.status;
	}
	if (
		error instanceof DynapicturesAPIError &&
		typeof error.status === 'number'
	) {
		return error.status;
	}
	return undefined;
}

/**
 * Standard error handlers for the Dynapictures plugin.
 * Classifies rate limits, authentication failures, and default server errors.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) {
				return status === 429;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof DynapicturesAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) {
				return status === 401;
			}
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
