import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Error routing for the Benchmark Email classic REST API v3.0.
 *
 * The provider signals throttling with HTTP 429 (hourly/hour budget of 500
 * calls per 2 minutes and 60,000 per day, plus temporary IP blocks after
 * repeated failed authentication) and always carries a `Retry-After`
 * header on the rejection.
 *
 * @see https://developer.benchmarkemail.com/ ("Limitations")
 * @see https://developers.benchmarkemail.io/rate-limits
 * @see https://developers.benchmarkemail.io/errors
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('ratelimited') ||
				msg.includes('too many requests') ||
				msg.includes('toomanyrequestserror') ||
				msg.includes('429')
			);
		},
		handler: async (_error: Error) => {
			// The transport layer (corsair/http request with our
			// RateLimitConfig) already retries 429s - honouring the
			// provider's Retry-After header - up to BENCHMARKEMAIL_RATE_LIMIT_CONFIG.maxRetries
			// attempts. Retrying again here would multiply the two policies
			// (a sustained 429 could otherwise issue maxRetries * maxRetries
			// requests), so this handler deliberately does not re-invoke the
			// endpoint; it only classifies the error for logging.
			return { maxRetries: 0 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('unauthorizederror') ||
				msg.includes('invalid api key') ||
				msg.includes('api key expired') ||
				msg.includes('expired') ||
				msg.includes('invalid_auth') ||
				msg.includes('missing_api_token')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('forbiddenerror') ||
				msg.includes('missing required scope')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('not found') ||
				msg.includes('notfound') ||
				msg.includes('recordnotfound')
			);
		},
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
