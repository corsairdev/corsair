import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Annotated (not `satisfies`) so match/handler keep the full canonical
// signature — callers and tests pass the error through uniformly.
export const errorHandlers: CorsairErrorHandler = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			// Word-bounded so substrings like "1429" or "4290" don't
			// misclassify unrelated errors as rate limits.
			return msg.includes('rate_limited') || /\b429\b/.test(msg);
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
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
};
