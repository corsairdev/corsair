import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('ratelimited') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error, _context: ErrorContext) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid_key')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[TWOCHAT:${context.operation}] Authentication failed – check your API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('permission_denied') ||
				msg.includes('insufficient')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[TWOCHAT:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('connection') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[TWOCHAT:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: (_error: Error, _context: ErrorContext) => true,
		handler: async (error: Error, context: ErrorContext) => {
			console.error(
				`[TWOCHAT:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
