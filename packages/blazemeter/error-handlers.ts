import type {
	CorsairErrorHandler,
	EndpointRiskLevel,
	ErrorContext,
} from 'corsair/core';
import { BlazemeterAPIError } from './client';
import { BLAZEMETER_OPERATIONS } from './operations';

function statusOf(error: Error): number | undefined {
	return error instanceof BlazemeterAPIError ? error.status : undefined;
}

const riskByOperation = new Map<string, EndpointRiskLevel>(
	BLAZEMETER_OPERATIONS.map(({ key, riskLevel }) => [key, riskLevel]),
);

/**
 * A retry decision here replays the *whole endpoint*: `bindEndpointsRecursively`
 * re-invokes the endpoint function when a handler returns `maxRetries > 0`, so a
 * retry after an ambiguous failure can apply a create/start/stop/delete twice.
 * Only `read` operations are safe to replay — this mirrors the transport-level
 * policy in `client.ts`, which already sends non-read requests with retries off.
 *
 * `context.operation` is the dot-notation endpoint path, which is identical to
 * the operation key for every BlazeMeter endpoint. Unknown paths are treated as
 * unsafe so a future endpoint cannot silently become replayable.
 */
function isReplaySafe(context: ErrorContext): boolean {
	return riskByOperation.get(context.operation) === 'read';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (_error: Error, context: ErrorContext) =>
			isReplaySafe(context)
				? { maxRetries: 3, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
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
		match: (error: Error) => statusOf(error) === 422,
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
