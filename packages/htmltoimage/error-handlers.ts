import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HtmlToImageAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof HtmlToImageAPIError) return error.status;
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof HtmlToImageAPIError) return error.retryAfter;
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
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = messageOf(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid_api_key') ||
				msg.includes('missing_api_key') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CREDIT_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 402) return true;
			const msg = messageOf(error);
			return (
				msg.includes('insufficient credits') ||
				msg.includes('insufficient_credits')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			const msg = messageOf(error);
			return msg.includes('not_subscribed') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 400 || getStatus(error) === 422) return true;
			const msg = messageOf(error);
			return msg.includes('validation') || msg.includes('render failed');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 504) return true;
			const msg = messageOf(error);
			return msg.includes('timed out') || msg.includes('timeout');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			return messageOf(error).includes('service error');
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
