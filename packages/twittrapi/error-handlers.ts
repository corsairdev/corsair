import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Error handlers for the TwittrAPI provider.
 *
 * TwittrAPI status codes (https://www.twittrapi.com/docs/helpful-infos/error-handling):
 * - 401 missing/unknown key, 402 no balance/trial expired, 403 deactivated
 * - 404 user/tweet not found, 422 invalid parameter
 * - 429 per-key rate limit (token bucket, no Retry-After header), not charged
 * - 400/408/409/5xx refunded, safe to retry with backoff
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('rate limit exceeded') ||
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
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof ApiError && error.status === 402) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('missing api key') ||
				msg.includes('user not found') ||
				msg.includes('no balance left') ||
				msg.includes('trial has expired') ||
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('deactivated') ||
				msg.includes('not included in your plan') ||
				msg.includes('permission_denied') ||
				msg.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return false;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 422) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid tweet id') || msg.includes('invalid username')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
