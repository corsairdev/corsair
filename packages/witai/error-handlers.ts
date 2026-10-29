import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { WitAiAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof WitAiAPIError) {
		return error.status;
	}
	if (error instanceof ApiError) {
		return error.status;
	}
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof WitAiAPIError) {
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
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('rate-limit') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
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
				msg.includes('access token does not match') ||
				msg.includes('authentication') ||
				msg.includes('token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			const msg = messageOf(error);
			return msg.includes('permission') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = messageOf(error);
			return (
				msg.includes('404') ||
				msg.includes('not found') ||
				msg.includes('unknown path')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 400) return true;
			const msg = messageOf(error);
			return (
				msg.includes('bad request') ||
				msg.includes('invalid') ||
				msg.includes('json-parse') ||
				msg.includes('bad-request')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = messageOf(error);
			return msg.includes('503') || msg.includes('server error');
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
