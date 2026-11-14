import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ShortcutNetworkError } from './client';
import { ShortcutOperations } from './endpoints/operations';

const isReadOperation = (operation: string): boolean =>
	Object.entries(ShortcutOperations).some(
		([id, detail]) =>
			operation.startsWith(`${id}.`) &&
			(detail.method === 'GET' || id === 'queryStories'),
	);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError
				? error.status === 429
				: /\b429\b|rate limit|too many requests/i.test(error.message),
		// corsair/http owns transient 429 retries and extracts Retry-After.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
		handler: async (_error: Error, context) => ({
			maxRetries: isReadOperation(context.operation) ? 2 : 0,
		}),
	},
	NETWORK_ERROR: {
		match: (error: Error) => error instanceof ShortcutNetworkError,
		handler: async (_error: Error, context) => ({
			maxRetries: isReadOperation(context.operation) ? 2 : 0,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
