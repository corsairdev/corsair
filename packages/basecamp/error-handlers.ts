import type { CorsairErrorHandler } from 'corsair/core';
import {
	BasecampAccountIdMissingError,
	BasecampAPIError,
	BasecampOAuthError,
	BasecampSchemaError,
} from './client';
import { basecampReadOperationPaths } from './endpoints/operations';

function mayRetry(context: { operation: string }): boolean {
	return basecampReadOperationPaths.has(
		context.operation as Parameters<typeof basecampReadOperationPaths.has>[0],
	);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof BasecampAPIError && error.status === 429,
		handler: async (error: Error, context) => ({
			maxRetries: mayRetry(context) ? 3 : 0,
			headersRetryAfterMs:
				error instanceof BasecampAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof BasecampOAuthError ||
			(error instanceof BasecampAPIError && error.status === 401),
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof BasecampAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof BasecampAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error instanceof BasecampAccountIdMissingError ||
			error instanceof BasecampSchemaError ||
			(error instanceof BasecampAPIError &&
				(error.status === 400 || error.status === 422)),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof BasecampAPIError &&
			error.status !== undefined &&
			error.status >= 500,
		handler: async (_error: Error, context) => ({
			maxRetries: mayRetry(context) ? 3 : 0,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) =>
			/fetch failed|network|econnreset|timeout/i.test(error.message),
		handler: async (_error: Error, context) => ({
			maxRetries: mayRetry(context) ? 3 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
