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
				errorMessage.includes('rate_limit') ||
				errorMessage.includes('ratelimited') ||
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
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('authentication failed') ||
				errorMessage.includes('invalid_auth')
			);
		},
		handler: async (error, context) => {
			console.log(
				`[JIRA:${context.operation}] Authentication failed - check your API key (email:apiToken format)`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error, _context) => {
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
				`[JIRA:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: (_error, _context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[JIRA:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
