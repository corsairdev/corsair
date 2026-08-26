import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CustomGPTAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof CustomGPTAPIError) {
		return error.status;
	}
	if (error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof CustomGPTAPIError) {
		return error.retryAfter;
	}
	if (error instanceof ApiError) {
		return error.retryAfter;
	}
	return undefined;
}

function messageOf(error: Error): string {
	return error.message.toLowerCase();
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = messageOf(error);
			return (
				msg.includes('429') ||
				msg.includes('rate limit') ||
				msg.includes('rate-limit') ||
				msg.includes('rate_limited') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff_jitter' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = messageOf(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('401') ||
				msg.includes('invalid_auth') ||
				msg.includes('authentication') ||
				msg.includes('token')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			const msg = messageOf(error);
			return (
				msg.includes('permission') ||
				msg.includes('forbidden') ||
				msg.includes('403')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = messageOf(error);
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 400) return true;
			return (
				messageOf(error).includes('invalid') || messageOf(error).includes('400')
			);
		},
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = messageOf(error);
			return (
				msg.includes('500') ||
				msg.includes('502') ||
				msg.includes('503') ||
				msg.includes('server error')
			);
		},
		handler: async (_error?: Error) => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (_error?: Error) => true,
		handler: async (_error?: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
