import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CertifierAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof CertifierAPIError) return error.status;
	return undefined;
}

function getRetryAfter(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof CertifierAPIError) return error.retryAfter;
	return undefined;
}

function messageOf(error: Error): string {
	return error.message.toLowerCase();
}

/**
 * Official error codes and statuses:
 * https://developers.certifier.io/docs/api-reference/error-handling
 */
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
			return messageOf(error).includes('unauthorized');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 402) return true;
			return messageOf(error).includes('payment_required');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			return messageOf(error).includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			return messageOf(error).includes('not_found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	CONFLICT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 409) return true;
			return messageOf(error).includes('conflict');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) return true;
			const msg = messageOf(error);
			return (
				msg.includes('validation_error') ||
				msg.includes('missing_version') ||
				msg.includes('invalid_version') ||
				msg.includes('invalid_json')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			return messageOf(error).includes('internal_server_error');
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
