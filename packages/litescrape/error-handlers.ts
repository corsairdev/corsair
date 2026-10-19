import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// LiteScrape publishes stable error bodies with a machine-readable
// `error_code`, `status_code` and `retryable` flag
// (https://litescrape.com/docs/reference#errors). Numeric statuses are the
// primary signal; the documented `error_code` strings are matched as a
// fallback for wrapped errors that lost their status.
function code(error: Error): string {
	return error.message.toLowerCase();
}

export const errorHandlers = {
	// 402 means the key needs a one-time top-up (reference#errors), so a
	// retry cannot succeed. Checked before the generic 429 retry because a
	// drained balance surfaces as a billing failure, not a rate limit.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = code(error);
			return msg.includes('402') || msg.includes('balance');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = code(error);
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('concurrency') ||
				msg.includes('429')
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
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = code(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('missing_api_key') ||
				msg.includes('invalid_api_key') ||
				msg.includes('api_key_disabled') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return code(error).includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 409 || error.status === 422)
			)
				return true;
			const msg = code(error);
			return (
				msg.includes('bad request') ||
				msg.includes('invalid request') ||
				msg.includes('invalid_request') ||
				msg.includes('validation_error') ||
				msg.includes('fetch_request_rejected') ||
				msg.includes('unknown parameter')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 503 is documented as retryable with a Retry-After hint, including the
	// `request_deadline_exceeded` code for requests that ran past the budget.
	SERVICE_UNAVAILABLE_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 503) return true;
			const msg = code(error);
			return (
				msg.includes('service_unavailable') ||
				msg.includes('request_deadline_exceeded') ||
				msg.includes('temporarily unavailable') ||
				msg.includes('503')
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
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
