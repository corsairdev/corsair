import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { WorldNewsApiError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: any, context?: any) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			if (error instanceof WorldNewsApiError && error.status === 429) {
				return true;
			}
			const message = (error?.message || '').toLowerCase();
			return (
				message.includes('rate_limit') ||
				message.includes('ratelimit') ||
				message.includes('429') ||
				message.includes('too many requests') ||
				message.includes('quota exceeded')
			);
		},
		handler: async (error: any, context: any) => {
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
		match: (error: any, context?: any) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			if (error instanceof WorldNewsApiError && error.status === 401) {
				return true;
			}
			const message = (error?.message || '').toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid api key') ||
				message.includes('auth_missing') ||
				message.includes('authentication failed')
			);
		},
		handler: async (error: any, context: any) => {
			console.warn(
				`[WORLDNEWSAPI:${context?.operation}] Authentication failed: please verify your WORLD_NEWS_API_KEY`,
			);
			return {
				maxRetries: 0,
			};
		},
	},

	PERMISSION_ERROR: {
		match: (error: any, context?: any) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			if (error instanceof WorldNewsApiError && error.status === 403) {
				return true;
			}
			const message = (error?.message || '').toLowerCase();
			return (
				message.includes('forbidden') ||
				message.includes('access denied') ||
				message.includes('insufficient_permissions')
			);
		},
		handler: async (error: any, context: any) => {
			console.warn(
				`[WORLDNEWSAPI:${context?.operation}] Access forbidden: ${error?.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},

	NOT_FOUND_ERROR: {
		match: (error: any, context?: any) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			if (error instanceof WorldNewsApiError && error.status === 404) {
				return true;
			}
			const message = (error?.message || '').toLowerCase();
			return message.includes('not found') || message.includes('404');
		},
		handler: async (error: any, context: any) => {
			return {
				maxRetries: 0,
			};
		},
	},

	BAD_REQUEST_ERROR: {
		match: (error: any, context?: any) => {
			if (error instanceof ApiError && error.status === 400) {
				return true;
			}
			if (error instanceof WorldNewsApiError && error.status === 400) {
				return true;
			}
			const message = (error?.message || '').toLowerCase();
			return (
				message.includes('bad request') ||
				message.includes('invalid_url') ||
				message.includes('malformed_url') ||
				message.includes('invalid_protocol') ||
				message.includes('ssrf_protected')
			);
		},
		handler: async (error: any, context: any) => {
			return {
				maxRetries: 0,
			};
		},
	},

	DEFAULT: {
		match: (error?: any, context?: any) => true,
		handler: async (error: any, context: any) => {
			console.error(
				`[WORLDNEWSAPI:${context?.operation}] Unhandled error: ${error?.message}`,
			);
			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
