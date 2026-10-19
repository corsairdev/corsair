import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// Handlers run in object order (first match wins). Octen rejects throttled
	// requests with HTTP 429 and asks callers to back off, so retries are
	// allowed and the documented `Retry-After` delay is honoured when present.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
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
	// 401 is a missing/invalid key and 403 is an exhausted account balance
	// (docs: "Insufficient account balance"); neither succeeds on retry, so
	// both stop here rather than looping.
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
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('insufficient balance') ||
				msg.includes('insufficient')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 covers missing/invalid parameters and 422 the image-search
	// unreadable-input case; both are terminal.
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('bad request') || msg.includes('invalid params');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
