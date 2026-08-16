import type { CorsairErrorHandler } from 'corsair/core';
import { BigmlAPIError } from './client';

/**
 * BigML's error body is `{"status": {"code": ..., "message": ...}}` (confirmed
 * from the SDK's `error_message` handling), but every handler here classifies
 * by HTTP status, never by scanning that body - the message-text fallback
 * below exists only for a bare `Error` carrying no status at all.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmlAPIError) return error.status === 429;
			return error.message.toLowerCase().includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs:
				error instanceof BigmlAPIError ? error.retryAfter : undefined,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmlAPIError) return error.status === 401;
			return error.message.toLowerCase().includes('401');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmlAPIError) {
				/**
				 * BigML's SDK reserves `HTTP_PAYMENT_REQUIRED` (402) alongside 403 on
				 * write operations - a plan/task-limit rejection, not a scope
				 * problem, but neither is retryable, so both land here.
				 */
				return error.status === 403 || error.status === 402;
			}
			return error.message.toLowerCase().includes('403');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmlAPIError) return error.status === 404;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
