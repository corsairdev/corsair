import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// The framework tries handlers in object order (first match wins), so
	// quota exhaustion is checked before the generic throttle handler:
	// a 429 means the plan quota is spent and retrying cannot succeed until
	// the billing cycle resets, while 403 responses are transient throttles.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('insufficient credits') ||
				msg.includes('insufficient_credits') ||
				msg.includes('quota') ||
				msg.includes('plan limit')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			// Hunter signals throttling with 403 (docs: 40 requests per 10s
			// window) and sets Retry-After.
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('missing api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 422 responses (for example sequence_locked, no_updatable_attributes)
	// are validation failures and cannot succeed on retry either.
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
				msg.includes('unprocessable') ||
				msg.includes('validation')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
