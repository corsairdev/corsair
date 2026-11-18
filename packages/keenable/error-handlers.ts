import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// The framework tries handlers in object order (first match wins), so
	// credit exhaustion is checked before the generic 429 retry below: a 402
	// (documented "no credits available", docs /credits) cannot succeed on
	// retry, while transient 429s can.
	INSUFFICIENT_CREDITS_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('insufficient credit') ||
				msg.includes('insufficient_credits') ||
				msg.includes('no credits')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError) return error.status === 429;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('too many requests') ||
				msg.includes('rate_limit')
			);
		},
		handler: async (error: Error) => {
			// 429 responses carry Retry-After
			// (docs /api-reference#limits-and-billing).
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			// 401 = missing/invalid key; 403 = disabled/revoked key
			// (docs /authentication).
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('invalid_auth') ||
				msg.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			// 400 covers invalid parameters and malformed key formats; the
			// documented "Missing app identifier" 400 is for the public paths.
			if (error instanceof ApiError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('invalid request') ||
				msg.includes('missing app identifier')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
