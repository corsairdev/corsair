import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.status;
	}
	if ('status' in error && typeof error.status === 'number') {
		return error.status;
	}
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) {
		return error.retryAfter;
	}
	if ('retryAfter' in error && typeof error.retryAfter === 'number') {
		return error.retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too_many_requests') ||
				msg.includes('too many requests') ||
				msg.includes('rate limit')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('unauthenticated');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	PAYMENT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('payment_required') || msg.includes('insufficient credits')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 400 || status === 415) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad_request') || msg.includes('unsupported_media_type')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('internal_server_error') ||
				msg.includes('service_unavailable')
			);
		},
		handler: async (_error: Error) => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
