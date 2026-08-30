import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { BubbleAPIError } from './client';

/**
 * Bubble's Data API errors are `{"statusCode": ..., "body": {...}}` and the
 * Workflow API's are `{"error_class": ..., "translation": ...}`, but every
 * handler here classifies by HTTP status only - the message-text fallbacks
 * below exist solely for a bare `Error` carrying no status at all.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BubbleAPIError) return error.status === 429;
			return error.message.toLowerCase().includes('429');
		},
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs:
				error instanceof BubbleAPIError ? error.retryAfter : undefined,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BubbleAPIError) return error.status === 401;
			return error.message.toLowerCase().includes('401');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof BubbleAPIError) return error.status === 403;
			return error.message.toLowerCase().includes('403');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof BubbleAPIError) return error.status === 404;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * A 5xx is Bubble's own infrastructure failing, not a bad request - worth
	 * a bounded retry, unlike every 4xx above.
	 *
	 * **Never for a non-idempotent POST.** `things.create`,
	 * `things.bulkCreate`, and `workflows.run` are the three POST operations
	 * here - a 5xx there can mean the request never reached Bubble, or that
	 * it was processed and only the *response* was lost. Retrying the second
	 * case creates a real duplicate resource. `context.operation` is the
	 * exact `family.op` dot-path and is always supplied by the real dispatch
	 * path; this fails closed (no retry) rather than open if that context is
	 * ever missing, since "unknown operation" cannot be proven safe to replay
	 * the way a confirmed GET/PATCH/PUT/DELETE can.
	 */
	SERVER_ERROR: {
		match: (error: Error, context?: ErrorContext) => {
			if (!(error instanceof BubbleAPIError)) return false;
			if (error.status === undefined || error.status < 500) return false;
			if (
				!context?.operation ||
				context.operation.endsWith('.create') ||
				context.operation.endsWith('.bulkCreate') ||
				context.operation.endsWith('.run')
			) {
				return false;
			}
			return true;
		},
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		}),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
