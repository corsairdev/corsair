import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KrakenAPIError } from './client';

/**
 * Only `account.checkStatus` is safe to retry: it's a read with no side
 * effects. Every `image.*` operation consumes account quota and has no
 * idempotency key, so if Kraken accepted the optimization before the 429/5xx
 * response reached us, retrying would resubmit the same non-idempotent write
 * and burn quota a second time for one logical request.
 */
function isRetryableOperation(context: ErrorContext): boolean {
	return context.operation === 'account.checkStatus';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof KrakenAPIError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate limit') || msg.includes('too many requests');
		},
		handler: async (error: Error, context: ErrorContext) => {
			if (!isRetryableOperation(context)) {
				return { maxRetries: 0 };
			}
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter * 1000;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs ?? 1000 };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			if (error instanceof KrakenAPIError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid credentials') ||
				msg.includes('invalid api_key') ||
				msg.includes('invalid api_secret')
			);
		},
		handler: async (_error: Error, _context: ErrorContext) => ({
			maxRetries: 0,
		}),
	},
	QUOTA_EXCEEDED_ERROR: {
		match: (error: Error) => {
			const msg = error.message.toLowerCase();
			return msg.includes('quota') || msg.includes('insufficient credits');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return msg.includes('invalid') || msg.includes('bad request');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status && error.status >= 500) {
				return true;
			}
			if (
				error instanceof KrakenAPIError &&
				error.status &&
				error.status >= 500
			) {
				return true;
			}
			return false;
		},
		handler: async (_error: Error, context: ErrorContext) => {
			if (!isRetryableOperation(context)) {
				return { maxRetries: 0 };
			}
			return { maxRetries: 2, headersRetryAfterMs: 1000 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
