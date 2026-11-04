import type { CorsairErrorHandler } from 'corsair/core';
import { SurfAPIError } from './client';

const RETRY_CAP_MS = 60_000;
const CREDIT_CODES = new Set([
	'FREE_QUOTA_EXHAUSTED',
	'PAID_BALANCE_ZERO',
	'INSUFFICIENT_CREDIT',
]);

function cappedRetryAfter(error: SurfAPIError): number | undefined {
	if (error.retryAfter === undefined) return undefined;
	const jitter = Math.floor(Math.random() * 250);
	return Math.min(error.retryAfter, RETRY_CAP_MS) + jitter;
}

export const errorHandlers = {
	// Credits share 402 with other payment failures and must not retry.
	INSUFFICIENT_CREDITS: {
		match: (error: Error) =>
			error instanceof SurfAPIError &&
			(error.status === 402 ||
				(error.code !== undefined && CREDIT_CODES.has(error.code))),
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	RATE_LIMIT: {
		match: (error: Error) =>
			error instanceof SurfAPIError &&
			(error.status === 429 || error.code === 'RATE_LIMITED'),
		handler: async (error: Error) => {
			const surf = error instanceof SurfAPIError ? error : undefined;
			const retryAfter = surf ? cappedRetryAfter(surf) : undefined;
			if (retryAfter !== undefined) {
				return { maxRetries: 2, headersRetryAfterMs: retryAfter };
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff_jitter' as const,
			};
		},
	},
	CLIENT_ERROR: {
		match: (error: Error) =>
			error instanceof SurfAPIError &&
			error.status !== undefined &&
			[400, 401, 404, 422].includes(error.status),
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	// Upstream 502/503/504 are documented as retryable. POST can bill a query, so only GET retries.
	UPSTREAM: {
		match: (error: Error) =>
			error instanceof SurfAPIError &&
			error.method === 'GET' &&
			error.status !== undefined &&
			[502, 503, 504].includes(error.status),
		handler: async (_error: Error) => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	DEFAULT: {
		match: (_error: Error) => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
