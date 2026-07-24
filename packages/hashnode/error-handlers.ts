import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HashnodeAPIError } from './client';

function extractHttpStatus(error: unknown): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof HashnodeAPIError) return error.status;
	return undefined;
}

function extractRetryAfter(error: unknown): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof HashnodeAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => {
			if (extractHttpStatus(error) === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('rate_limited') ||
				errorMessage.includes('ratelimited') ||
				errorMessage.includes('rate limit') ||
				errorMessage.includes('too many requests') ||
				error.message.includes('429')
			);
		},
		handler: async (error, _context) => {
			return {
				maxRetries: 3,
				headersRetryAfterMs: extractRetryAfter(error),
				retryStrategy: 'exponential_backoff_jitter' as const,
			};
		},
	},
	AUTH_ERROR: {
		match: (error, _context) => {
			if (extractHttpStatus(error) === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('unauthenticated') ||
				errorMessage.includes('authentication') ||
				errorMessage.includes('invalid token') ||
				errorMessage.includes('token expired') ||
				errorMessage.includes('token revoked') ||
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('invalid pat')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error, _context) => {
			if (extractHttpStatus(error) === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				errorMessage.includes('does not exist') ||
				errorMessage.includes('could not find')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error, _context) => {
			if (extractHttpStatus(error) === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permission denied') ||
				errorMessage.includes('pro plan') ||
				errorMessage.includes('insufficient permissions')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error, _context) => {
			if (extractHttpStatus(error) === 400) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('validation') ||
				errorMessage.includes('invalid input') ||
				errorMessage.includes('bad request') ||
				errorMessage.includes('malformed') ||
				errorMessage.includes('required field') ||
				errorMessage.includes('graphql validation')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	GRAPHQL_ERROR: {
		match: (error, _context) => {
			if (!(error instanceof HashnodeAPIError)) {
				return false;
			}
			if (error.status !== undefined) {
				return false;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('graphql') ||
				errorMessage.includes('cannot query') ||
				errorMessage.includes('unknown field') ||
				errorMessage.includes('syntax error') ||
				errorMessage.includes('variable') ||
				errorMessage.includes('argument')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error, _context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed') ||
				errorMessage.includes('network error')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
