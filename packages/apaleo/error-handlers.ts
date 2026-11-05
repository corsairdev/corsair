import type { CorsairErrorHandler } from 'corsair/core';
import type { ApaleoAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<ApaleoAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<ApaleoAPIError>).retryAfter;
}

const CREATE_OPS = new Set([
	'properties.create',
	'properties.clone',
	'units.create',
	'units.createBulk',
	'unitAttributes.create',
	'unitGroups.create',
]);

/**
 * Apaleo 429 includes Retry-After in seconds; ApaleoAPIError.retryAfter is ms.
 * https://apaleo.dev/guides/api/rate-limiting.html
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => getStatus(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => getStatus(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => getStatus(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => getStatus(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async (_error, context) => ({
			maxRetries: CREATE_OPS.has(context.operation) ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
