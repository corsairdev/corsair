import type { CorsairErrorHandler } from 'corsair/core';
import { TRANSPORT_ERROR_CODE, TursoAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof TursoAPIError ? error.status : undefined;
}

function messageOf(error: Error): string {
	return error.message.toLowerCase();
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 429) return true;
			const msg = messageOf(error);
			return msg.includes('rate_limited') || msg.includes('too many requests');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs:
				error instanceof TursoAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			if (status === 401 || status === 403) return true;
			const msg = messageOf(error);
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('expired token') ||
				msg.includes('invalid token')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	/**
	 * A request that never reached Turso — DNS, TCP, TLS or timeout. Transient
	 * and safe to retry, so it is classified ahead of DEFAULT rather than
	 * falling through to the no-retry policy.
	 */
	NETWORK_ERROR: {
		match: (error: Error) =>
			error instanceof TursoAPIError &&
			error.status === undefined &&
			error.code === TRANSPORT_ERROR_CODE,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff_jitter' as const,
		}),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (statusOf(error) === 404) return true;
			return messageOf(error).includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
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
