import type { CorsairErrorHandler } from 'corsair/core';
import { PostalyticsAPIError, PostalyticsRateLimitError } from './client';

const MAX_RETRY_WAIT_MS = 60_000;

export const errorHandlers = {
	// The client calls fetch itself, so core's request() retries never run and
	// this handler is the only 429 retry. A 429 means Postalytics refused the
	// request before running it, so replaying it is safe for writes too. A wait
	// over a minute (a quota reset, not a burst limit) goes back to the caller.
	// `Retry-After: 0` counts as no wait given: the retry backs off 1 s, 2 s,
	// 4 s instead of firing at once into a three-requests-per-second limit.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof PostalyticsRateLimitError,
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof PostalyticsRateLimitError
					? error.retryAfterMs
					: undefined;
			const waitMs =
				retryAfterMs !== undefined && retryAfterMs > 0
					? retryAfterMs
					: undefined;
			if (waitMs !== undefined && waitMs > MAX_RETRY_WAIT_MS)
				return { maxRetries: 0 };
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: waitMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof PostalyticsAPIError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
