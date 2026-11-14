import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		// Core's request() has already retried 429 responses (three times, honoring Retry-After)
		// before it reaches an endpoint handler. Single-owner rate limiting mandates maxRetries: 0 here
		// to avoid multiplicative retry loops.
		handler: async (_error?: Error, _context?: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key')
			);
		},
		handler: async (_error?: Error, _context?: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('validation') ||
				msg.includes('unprocessable')
			);
		},
		handler: async (_error?: Error, _context?: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error, _context?: ErrorContext) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async (_error?: Error, _context?: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	DEFAULT: {
		match: (_error?: Error, _context?: ErrorContext) => true,
		handler: async (_error?: Error, _context?: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
} satisfies CorsairErrorHandler;
