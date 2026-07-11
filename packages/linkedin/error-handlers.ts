import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { LinkedInAPIError } from './client';

// makeLinkedInRequest wraps every ApiError into LinkedInAPIError before it
// reaches these matchers, so status checks must look at LinkedInAPIError
// first; the ApiError branches remain for errors thrown outside the wrapper.
function statusOf(error: Error): number | undefined {
	if (error instanceof LinkedInAPIError) return error.status;
	if (error instanceof ApiError) return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			// LinkedIn's canonical 429 body says "Too Many Requests" without
			// mentioning the numeric status, so match the phrase as well.
			return (
				msg.includes('rate_limited') ||
				msg.includes('too many requests') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof LinkedInAPIError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
