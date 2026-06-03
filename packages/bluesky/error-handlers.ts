import type { CorsairErrorHandler } from 'corsair/core';
import { BlueskyAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof BlueskyAPIError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate limit exceeded') ||
				errorMessage.includes('too_many_requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof BlueskyAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error, context) => {
			if (
				error instanceof BlueskyAPIError &&
				(error.status === 401 || error.code === 'SESSION_CREATION_FAILED')
			) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid_token') ||
				errorMessage.includes('authentication failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BLUESKY:${context.operation}] Authentication failed - check your handle and app password`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof BlueskyAPIError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('not-authorized-for-resource') ||
				errorMessage.includes('access_denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BLUESKY:${context.operation}] Permission denied: ${error.message}`,
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
				`[BLUESKY:${context.operation}] Unhandled error: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
