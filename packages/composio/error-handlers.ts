import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ComposioAPIError } from './client';

/**
 * Errors raised by this plugin's endpoints are ComposioAPIError (makeComposioRequest
 * wraps every ApiError before it escapes). Match the structured status/retryAfter
 * fields on ComposioAPIError first; keep ApiError checks for callers that surface
 * the raw transport error.
 */
function statusIs(error: Error, status: number): boolean {
	if (error instanceof ComposioAPIError && error.status === status) return true;
	if (error instanceof ApiError && error.status === status) return true;
	return false;
}

function retryAfterMsOf(error: Error): number | undefined {
	if (error instanceof ComposioAPIError) return error.retryAfter;
	if (error instanceof ApiError) return error.retryAfter;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			// Prefer structured status — avoid substring "429" false positives.
			if (statusIs(error, 429)) return true;
			const msg = error.message.toLowerCase();
			return (
				/\brate[_ ]?limit(?:ed)?\b/.test(msg) ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs = retryAfterMsOf(error);
			if (retryAfterMs !== undefined) {
				// Respect an explicit Retry-After delay from the API.
				return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
			}
			// No Retry-After header: back off exponentially instead of firing
			// retries back-to-back against a throttled endpoint.
			return { maxRetries: 5, retryStrategy: 'exponential_backoff' };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (statusIs(error, 401)) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_api_key') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
