import type { CorsairErrorHandler } from 'corsair/core';
import { D2lBrightspaceAPIError } from './client';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof D2lBrightspaceAPIError &&
			(error.status === 429 || error.retryAfter !== undefined),
		handler: async (error: Error) => ({
			// The transport owns Retry-After extraction; no nested retry loop is enabled.
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof D2lBrightspaceAPIError ? error.retryAfter : undefined,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof D2lBrightspaceAPIError && error.status === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) =>
			error instanceof D2lBrightspaceAPIError && error.status === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) =>
			error instanceof D2lBrightspaceAPIError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof D2lBrightspaceAPIError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof D2lBrightspaceAPIError &&
			error.status !== undefined &&
			error.status >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
