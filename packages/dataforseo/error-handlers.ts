import type { CorsairErrorHandler } from 'corsair/core';
import { DataForSeoAPIError } from './client';

// Codes: https://docs.dataforseo.com/v3/appendix/errors/
function codeOf(error: Error): number | undefined {
	return error instanceof DataForSeoAPIError ? error.code : undefined;
}

function statusOf(error: Error): number | undefined {
	return error instanceof DataForSeoAPIError ? error.status : undefined;
}

const is = (codes: readonly number[]) => (error: Error) =>
	codes.includes(codeOf(error) ?? -1);

export const errorHandlers = {
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error.name === 'ZodError' ||
			is([40000, 40006, 40501, 40502, 40503, 40504, 40505, 40506])(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// 40104: the DataForSEO account has not been verified in the user panel.
	AUTH_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 401 || is([40100, 40104])(error),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Balance, cost limit, subscription (40204), IP whitelist, account pause.
	BILLING_OR_ACCESS_ERROR: {
		match: is([40200, 40201, 40203, 40204, 40207, 40210]),
		handler: async () => ({ maxRetries: 0 }),
	},
	// Per-minute rate limit and simultaneous-request limit.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			statusOf(error) === 429 || is([40202, 40209])(error),
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof DataForSeoAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Hourly or daily duplicate-task limits; retrying would hit the same limit.
	DUPLICATE_LIMIT_ERROR: {
		match: is([40205, 40206]),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: is([40400, 40401, 40402, 40403, 40404, 40105]),
		handler: async () => ({ maxRetries: 0 }),
	},
	// A task_get before the task finished; fetch it again later.
	TASK_NOT_READY: {
		match: is([40601, 40602]),
		handler: async () => ({ maxRetries: 0 }),
	},
	// The error reference asks to resubmit the task for these codes.
	SERVER_ERROR: {
		match: (error: Error) => {
			const code = codeOf(error);
			const status = statusOf(error);
			return (
				(code !== undefined &&
					(code >= 50000 || code === 40101 || code === 40103)) ||
				(status !== undefined && status >= 500)
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
