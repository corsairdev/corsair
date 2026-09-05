import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CdrPlatformAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof CdrPlatformAPIError) return error.status;
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof CdrPlatformAPIError) return error.retryAfter;
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
				msg.includes('rate_limited') ||
				msg.includes('too many requests') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = messageOf(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('authentication') ||
				msg.includes('api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) return true;
			const msg = messageOf(error);
			return msg.includes('validation') || msg.includes('invalid');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			return messageOf(error).includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			return messageOf(error).includes('server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
