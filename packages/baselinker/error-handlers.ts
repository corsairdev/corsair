import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BaseLinkerAPIError } from './client';
import { baseLinkerReadOperationPaths } from './endpoints/operations';

function mayRetry(context: { operation: string }): boolean {
	return baseLinkerReadOperationPaths.has(
		context.operation as Parameters<typeof baseLinkerReadOperationPaths.has>[0],
	);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			(error instanceof BaseLinkerAPIError &&
				/RATE_LIMIT|TOO_MANY/i.test(error.code ?? error.message)),
		handler: async (error: Error, context) => ({
			maxRetries: mayRetry(context) ? 5 : 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 401) ||
			(error instanceof BaseLinkerAPIError &&
				/AUTH|TOKEN/i.test(error.code ?? error.message)),
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 403) ||
			(error instanceof BaseLinkerAPIError &&
				/PERMISSION|ACCESS|FORBIDDEN/i.test(error.code ?? error.message)),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 404) ||
			(error instanceof BaseLinkerAPIError &&
				/NOT_FOUND|NO_.*FOUND/i.test(error.code ?? error.message)),
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 400 || error.status === 422)) ||
			(error instanceof BaseLinkerAPIError &&
				/PARAM|VALID|EMPTY|INVALID/i.test(error.code ?? error.message)),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
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
