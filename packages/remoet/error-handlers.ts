import type { CorsairErrorHandler } from 'corsair/core';
import { RemoetAPIError } from './client';

/** Reads the HTTP status of a Remoet error; the client wraps every failure. */
function statusOf(error: Error): number | undefined {
	return error instanceof RemoetAPIError ? error.status : undefined;
}

/**
 * Remoet answers 429 for two different limits. The per-minute limit clears
 * within a minute and is worth retrying. The daily request cap (an abuse
 * threshold, reported with a "Daily ... request limit reached" message) does
 * not clear until the next UTC day, so retrying only burns time. The client
 * copies Remoet's body message onto the error, so the message tells them apart.
 */
export function isRemoetDailyCapError(error: Error): boolean {
	return (
		statusOf(error) === 429 && /daily .*request limit/i.test(error.message)
	);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => {
			if (isRemoetDailyCapError(error)) return { maxRetries: 0 };
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff_jitter' as const,
				headersRetryAfterMs:
					error instanceof RemoetAPIError ? error.retryAfter : undefined,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 409;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
