import type { CorsairErrorHandler } from 'corsair/core';
import { YoutubeAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof YoutubeAPIError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate limit exceeded') ||
				errorMessage.includes('quota exceeded') ||
				errorMessage.includes('too_many_requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof YoutubeAPIError && error.retryAfter !== undefined) {
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
			if (error instanceof YoutubeAPIError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('invalid_token') ||
				errorMessage.includes('authentication failed') ||
				errorMessage.includes('invalid credentials')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[YOUTUBE:${context.operation}] Authentication failed - check your access token`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof YoutubeAPIError && error.status === 403) {
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
				`[YOUTUBE:${context.operation}] Permission denied: ${error.message}`,
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
				`[YOUTUBE:${context.operation}] Unhandled error: ${error.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
