import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

function getStatus(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function getRetryAfter(error: Error): number | undefined {
	return error instanceof ApiError ? error.retryAfter : undefined;
}

/**
 * Live error surface (Laravel, 2026-08-19):
 *   401  invalid / missing Bearer token
 *   404  unknown route (`The route api/... could not be found.`)
 *   405  GET /jobs/{id} — only PUT and DELETE are supported
 *   429  `x-ratelimit-limit: 60` on successful calls; Retry-After on 429
 *   5xx  standard Laravel
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('too many requests');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('unauthenticated');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('could not be found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			return error.message.includes('500');
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
