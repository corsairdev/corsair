import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { FixerAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => {
			// fixerGet always wraps transport and business errors in a
			// FixerAPIError, so this must check the wrapper, not the raw ApiError.
			if (
				error instanceof FixerAPIError &&
				(error.status === 429 || error.apiType === 'usage_limit_reached')
			) {
				return true;
			}
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate limit') ||
				errorMessage.includes('too_many_requests') ||
				errorMessage.includes('usage_limit_reached') ||
				errorMessage.includes('429')
			);
		},
		handler: async (error, _context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof FixerAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (error instanceof ApiError && error.retryAfter !== undefined) {
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
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid_access_key') ||
				errorMessage.includes('missing_access_key') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('inactive_user')
			);
		},
		handler: async (error, context) => {
			console.warn(`[FIXER:${context.operation}] Authentication failed`);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (error, context) => {
			console.error(
				`[FIXER:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
