import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('ratelimited') ||
				msg.includes('429')
			);
		},
		handler: async (error, _context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid token') ||
				msg.includes('token expired') ||
				msg.includes('authentication failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[GRAFANA:${context.operation}] Authentication failed — check your Service Account Token`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('permission denied') ||
				msg.includes('insufficient permissions') ||
				msg.includes('access denied')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[GRAFANA:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[GRAFANA:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error, _context) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('connection') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed') ||
				msg.includes('network error')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[GRAFANA:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (error, context) => {
			console.error(
				`[GRAFANA:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
