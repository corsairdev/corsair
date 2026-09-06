import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import type { SpokiApiError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<SpokiApiError>).status;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('ratelimited') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[SPOKI:${context.operation}] Rate limited: ${error.message}`,
			);
			return { maxRetries: 3, retryStrategy: 'linear_3s' as const };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_api_key') ||
				msg.includes('missing api key')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[SPOKI:${context.operation}] Authentication failed – check your API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden') || msg.includes('permission_denied');
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[SPOKI:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			if (getStatus(error) === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(`[SPOKI:${context.operation}] Not found: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error, _context: ErrorContext) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			return false;
		},
		handler: async (error: Error, context: ErrorContext) => {
			console.warn(
				`[SPOKI:${context.operation}] Server error: ${error.message}`,
			);
			return { maxRetries: 3, retryStrategy: 'exponential_backoff' as const };
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
				`[SPOKI:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: (_error: Error, _context: ErrorContext) => true,
		handler: async (error: Error, context: ErrorContext) => {
			console.error(
				`[SPOKI:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
