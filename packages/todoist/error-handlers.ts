import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			// Check for HTTP 429 status code
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			// Check error message for rate limit indicators
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			// Extract Retry-After from headers if available
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
			// Check for HTTP 401 status code
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			// Check error message for auth failure indicators
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication failed')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[TODOIST:${context.operation}] Authentication failed - check your API key`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, context) => {
			// Check for HTTP 403 status code
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			// Check error message for permission denial indicators
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TODOIST:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true; // Matches all errors
		},
		handler: async (error, context) => {
			console.error(
				`[TODOIST:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
