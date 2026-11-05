import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GiphyAPIError } from './client';

// Endpoints throw GiphyAPIError (not the transport's ApiError), so the
// matchers below read through the wrapper. `GiphyAPIError` copies `status`
// and the rate-limit metadata off the cause, which makes a structural read
// sufficient — no cast is needed.
function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof GiphyAPIError) return error.status;
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof GiphyAPIError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		handler: async (error: Error) => {
			return { maxRetries: 5, headersRetryAfterMs: retryAfterOf(error) };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			// GIPHY surfaces key problems as 401 (invalid key) and 403
			// (e.g. uploads from unapproved keys); both are non-retryable.
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid_auth')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
