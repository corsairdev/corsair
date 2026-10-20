import type { CorsairErrorHandler } from 'corsair/core';
import { OrbitAPIError } from './client';

const RETRY_CAP_MS = 60_000;

function cappedRetryAfter(error: OrbitAPIError): number | undefined {
	if (error.retryAfter === undefined) return undefined;
	const jitter = Math.floor(Math.random() * 250);
	return Math.min(error.retryAfter, RETRY_CAP_MS) + jitter;
}

function canReplay(error: OrbitAPIError): boolean {
	return error.method === 'GET' || error.hasIdempotency;
}

export const errorHandlers = {
	IDEMPOTENCY_CONFLICT: {
		match: (error: Error) =>
			error instanceof OrbitAPIError && error.status === 409,
		handler: async () => ({ maxRetries: 0 }),
	},
	INSUFFICIENT_CREDITS: {
		match: (error: Error) =>
			error instanceof OrbitAPIError &&
			(error.status === 402 ||
				error.code === 'developer_api_credits_insufficient'),
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	RATE_LIMIT: {
		match: (error: Error) =>
			error instanceof OrbitAPIError &&
			(error.status === 429 || error.code === 'developer_api_key_rate_limited'),
		handler: async (error: Error) => {
			const orbit = error instanceof OrbitAPIError ? error : undefined;
			const retryAfter = orbit ? cappedRetryAfter(orbit) : undefined;
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
			error instanceof OrbitAPIError &&
			error.status !== undefined &&
			[400, 401, 403, 404, 413, 422].includes(error.status),
		handler: async (_error: Error) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof OrbitAPIError &&
			(error.status === 500 || error.status === 503),
		handler: async (error: Error) => {
			if (error instanceof OrbitAPIError && canReplay(error)) {
				return {
					maxRetries: 1,
					retryStrategy: 'exponential_backoff_jitter' as const,
				};
			}
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
