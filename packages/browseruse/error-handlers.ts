import type { CorsairErrorHandler } from 'corsair/core';
import { BrowserUseAPIError, BrowserUseRateLimitError } from './client';

const RETRY_AFTER_CAP_MS = 60_000;

function cappedRetryAfter(error: Error): number | undefined {
	if (!(error instanceof BrowserUseAPIError)) return undefined;
	if (error.retryAfterMs === undefined) return undefined;
	const jitter = Math.floor(Math.random() * 250);
	return Math.min(error.retryAfterMs, RETRY_AFTER_CAP_MS) + jitter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BrowserUseRateLimitError) return true;
			return error instanceof BrowserUseAPIError && error.status === 429;
		},
		handler: async (error: Error) => ({
			// Two retries after the first call. A missing Retry-After uses backoff.
			maxRetries: 2,
			headersRetryAfterMs: cappedRetryAfter(error),
			retryStrategy: 'exponential_backoff_jitter' as const, // as is necessary: this must stay a literal. A wider type is not practical.
		}),
	},
	// Only cancel documents a 503 that should be repeated. A create 503 must not start a second browser or run.
	FINISHING_ERROR: {
		match: (error: Error) =>
			error instanceof BrowserUseAPIError &&
			error.status === 503 &&
			error.path?.endsWith('/cancel') === true,
		handler: async (error: Error) => ({
			maxRetries: 2,
			headersRetryAfterMs: cappedRetryAfter(error),
			retryStrategy: 'exponential_backoff_jitter' as const, // as is necessary: this must stay a literal. A wider type is not practical.
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof BrowserUseAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
