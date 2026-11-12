import type {
	CorsairErrorHandler,
	EndpointRiskLevel,
	ErrorContext,
} from 'corsair/core';
import { MissiveAPIError } from './client';
import { MISSIVE_OPERATIONS } from './operations';

function statusOf(error: Error): number | undefined {
	return error instanceof MissiveAPIError ? error.status : undefined;
}

const riskByOperation = new Map<string, EndpointRiskLevel>(
	MISSIVE_OPERATIONS.map(({ key, riskLevel }) => [key, riskLevel]),
);

/**
 * A retry decision here replays the *whole endpoint*: the shared binder
 * re-invokes the endpoint function when a handler returns `maxRetries > 0`.
 * Replaying a create/update/delete/merge after an ambiguous failure could
 * apply the change twice, so only operations marked `read` are retried.
 * Unknown paths default to unsafe.
 */
function isReplaySafe(context: ErrorContext): boolean {
	return riskByOperation.get(context.operation) === 'read';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error, context: ErrorContext) => {
			if (!isReplaySafe(context)) return { maxRetries: 0 };
			const retryAfter =
				error instanceof MissiveAPIError ? error.retryAfter : undefined;
			return {
				maxRetries: 5,
				retryStrategy: 'exponential_backoff' as const,
				// Missive documents Retry-After in seconds on 429; the shared
				// client hands the value over in milliseconds and it passes
				// through unchanged, so a long window is never cut short.
				headersRetryAfterMs: retryAfter,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => statusOf(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status !== undefined && status >= 500;
		},
		handler: async (_error: Error, context: ErrorContext) =>
			isReplaySafe(context)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
