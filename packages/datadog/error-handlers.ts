import type { CorsairErrorHandler } from 'corsair/core';
import type { DatadogAPIError } from './client';

// Narrowing helpers: the framework hands error handlers a base Error; the
// DatadogAPIError fields are optional extras, so Partial is the safest view.
function getStatus(error: Error): number | undefined {
	return (error as Partial<DatadogAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<DatadogAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('429') || message.includes('rate limit');
		},
		handler: async (error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error) => {
			if (getStatus(error) === 401) return true;
			const message = error.message.toLowerCase();
			return message.includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[DATADOG:${context.operation}] Authentication failed — check the API key: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => {
			if (getStatus(error) === 403) return true;
			const message = error.message.toLowerCase();
			return message.includes('forbidden') || message.includes('permission');
		},
		handler: async (error, context) => {
			console.warn(
				`[DATADOG:${context.operation}] Permission denied — most management endpoints also require an application key (DD-APPLICATION-KEY): ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (getStatus(error) === 400) return true;
			const message = error.message.toLowerCase();
			return message.includes('bad request') || message.includes('validation');
		},
		handler: async (error, context) => {
			console.warn(
				`[DATADOG:${context.operation}] Bad request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const message = error.message.toLowerCase();
			return message.includes('500') || message.includes('server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[DATADOG:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
