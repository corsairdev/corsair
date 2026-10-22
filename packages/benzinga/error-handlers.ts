import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				errorMessage.includes('too many requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 5,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('auth_failed') ||
				errorMessage.includes('invalid or missing authentication token')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BENZINGA:${context.operation}] Authentication failed - check your API key`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('insufficient_permissions') ||
				errorMessage.includes('access_denied') ||
				errorMessage.includes('permission_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BENZINGA:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not_found') ||
				errorMessage.includes('no_data_found') ||
				errorMessage.includes('not found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BENZINGA:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed') ||
				errorMessage.includes('network error')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BENZINGA:${context.operation}] Network error: ${error.message}`,
			);

			return {
				maxRetries: 3,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[BENZINGA:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
