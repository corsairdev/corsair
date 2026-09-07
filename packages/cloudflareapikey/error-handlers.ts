import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CloudflareApiKeyAPIError } from './api-error';

function statusOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof CloudflareApiKeyAPIError) {
		return error.status;
	}
	return undefined;
}

function retryAfterOf(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof CloudflareApiKeyAPIError) {
		return error.retryAfter;
	}
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs: retryAfterOf(error),
		}),
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
		// Corsair retries by rerunning the whole endpoint. DNS create, lockdown
		// create, ruleset create/update, and R2 upload are not idempotent, so
		// unmatched 5xx/timeouts must not replay the mutation.
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
