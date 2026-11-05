import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { BrightDataAPIError, BrightDataRateLimitError } from './client';

const SNAPSHOT_WRITE_OPS = new Set(['crawlApi', 'filterDataset']);

function retryAfterMsFrom(error: Error): number | undefined {
	return error instanceof BrightDataRateLimitError
		? error.retryAfterMs
		: undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BrightDataRateLimitError) return true;
			if (error instanceof BrightDataAPIError && error.status === 429) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('rate limit') ||
				msg.includes('rate_limited') ||
				msg.includes('429')
			);
		},
		handler: async (error: Error, context: ErrorContext) => {
			const retryAfterMs = retryAfterMsFrom(error);
			if (SNAPSHOT_WRITE_OPS.has(context.operation)) {
				return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof BrightDataAPIError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('authentication') ||
				msg.includes('forbidden') ||
				msg.includes('401')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
