import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function errorStatus(error: Error): number | undefined {
	if (
		'status' in error &&
		typeof (error as { status: unknown }).status === 'number'
	) {
		return (error as { status: number }).status;
	}
	return undefined;
}

function errorRetryAfter(error: Error): number | undefined {
	if (
		'retryAfter' in error &&
		typeof (error as { retryAfter: unknown }).retryAfter === 'number'
	) {
		return (error as { retryAfter: number }).retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context) => {
			if (errorStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error, _context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else {
				retryAfterMs = errorRetryAfter(error);
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _context) => {
			if (errorStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
