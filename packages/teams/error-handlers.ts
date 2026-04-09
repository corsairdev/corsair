import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('too_many_requests') ||
				errorMessage.includes('throttled') ||
				error.message.includes('429')
			);
		},
		handler: async (error, _context) => {
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
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalidauthenticationtoken') ||
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[TEAMS:${context.operation}] Authentication failed - check your access token`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('accessdenied') ||
				errorMessage.includes('forbidden') ||
				errorMessage.includes('insufficient privileges')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[TEAMS:${context.operation}] Permission denied: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, _context) => {
			return error instanceof ApiError && error.status === 404;
		},
		handler: async (error, context) => {
			console.warn(
				`[TEAMS:${context.operation}] Resource not found: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	DEFAULT: {
		match: (_error, _context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[TEAMS:${context.operation}] Unhandled error: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
