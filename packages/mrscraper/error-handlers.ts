import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// Transient throttling: the docs document 429 with a `Retry-After` header,
	// so retry a few times and honour the server's delay when present.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			// The HTTP status is authoritative: only a real 429 is retried. The
			// text fallback is for wrapped errors that lost their status, so a
			// 500 body or a ZodError quoting "rate limit" is not retried (each
			// scrape.* retry can start another billed scrape).
			if (error instanceof ApiError) return error.status === 429;
			const msg = error.message.toLowerCase();
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	// Bad or revoked credentials cannot succeed on retry.
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
				msg.includes('invalid token') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Malformed or unprocessable requests cannot succeed on retry.
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
