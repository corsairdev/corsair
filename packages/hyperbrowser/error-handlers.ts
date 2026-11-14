import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// First match wins. Check credit/quota exhaustion first: billing or credit
	// depletion cannot succeed on retry, so we fail fast with 0 retries per R8.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('insufficient credits') ||
				msg.includes('insufficient_credits') ||
				msg.includes('credits exhausted') ||
				msg.includes('quota exceeded') ||
				msg.includes('402')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Transport passes RateLimitConfig with maxRetries: 0 so the handler owns
	// transient rate-limit retries while parsing Retry-After headers from the transport.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('429')
			);
		},
		handler: async (error?: Error) => {
			const retryAfter =
				error instanceof ApiError ? error.retryAfter : undefined;
			return {
				maxRetries: 2,
				headersRetryAfterMs: retryAfter,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('missing api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid request') ||
				msg.includes('validation error')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
