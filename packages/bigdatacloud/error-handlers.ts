import type { CorsairErrorHandler } from 'corsair/core';
import { BigDataCloudAPIError } from './client';

function getStatus(error: unknown): number | undefined {
	if (error instanceof BigDataCloudAPIError) {
		return error.status;
	}
	if (error && typeof error === 'object' && 'status' in error) {
		return (error as { status?: number }).status;
	}
	return undefined;
}

function getRetryAfter(error: unknown): number | undefined {
	if (error instanceof BigDataCloudAPIError) {
		return error.retryAfter;
	}
	if (error && typeof error === 'object' && 'retryAfter' in error) {
		return (error as { retryAfter?: number }).retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('429') ||
				msg.includes('too many requests') ||
				msg.includes('quota exceeded')
			);
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 5,
				headersRetryAfterMs: getRetryAfter(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid key') ||
				msg.includes('api key required') ||
				msg.includes('auth_error')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (
				status === 500 ||
				status === 502 ||
				status === 503 ||
				status === 504
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('internal server error') ||
				msg.includes('bad gateway') ||
				msg.includes('service unavailable') ||
				msg.includes('gateway timeout')
			);
		},
		handler: async () => ({ maxRetries: 2 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
