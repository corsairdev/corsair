import type { CorsairErrorHandler } from 'corsair/core';
import {
	BitbucketAPIError,
	BitbucketOAuthError,
	BitbucketSchemaError,
} from './client';
import { bitbucketReadOperationPaths } from './endpoints/operations';

const mayRetry = (context: { operation: string }) =>
	bitbucketReadOperationPaths.has(context.operation as never);
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof BitbucketAPIError && error.status === 429,
		handler: async (error: Error, context) => ({
			maxRetries: mayRetry(context) ? 3 : 0,
			headersRetryAfterMs:
				error instanceof BitbucketAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof BitbucketOAuthError ||
			(error instanceof BitbucketAPIError && error.status === 401),
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof BitbucketAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof BitbucketAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) =>
			error instanceof BitbucketSchemaError ||
			(error instanceof BitbucketAPIError &&
				[400, 409, 422].includes(error.status ?? 0)),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof BitbucketAPIError && (error.status ?? 0) >= 500,
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
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
} satisfies CorsairErrorHandler;
