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
				errorMessage.includes('invalid_auth') ||
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication failed') ||
				errorMessage.includes('invalid_token')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[CALENDLY:${context.operation}] Authentication failed - check your API key`,
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
				errorMessage.includes('permission_denied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[CALENDLY:${context.operation}] Permission denied: ${error.message}`,
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
			return error.message.toLowerCase().includes('not_found');
		},
		handler: async (error, context) => {
			console.warn(
				`[CALENDLY:${context.operation}] Resource not found: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[CALENDLY:${context.operation}] Unhandled error: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
