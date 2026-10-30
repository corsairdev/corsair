import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { BubbleAPIError } from './client';

/** GET/PATCH/PUT/DELETE Data API reads and metadata. Workflow GET/POST are side-effecting. */
function isIdempotent(operation: string | undefined): boolean {
	return (
		operation === 'things.get' ||
		operation === 'things.list' ||
		operation === 'things.update' ||
		operation === 'things.replace' ||
		operation === 'things.delete' ||
		operation === 'meta.getSwagger'
	);
}

function isUnsafeWrite(operation: string | undefined): boolean {
	return (
		!operation ||
		operation.endsWith('.create') ||
		operation.endsWith('.bulkCreate') ||
		operation.endsWith('.run') ||
		operation.endsWith('.runGet')
	);
}

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
		/**
		 * Single retry loop: transport `maxRetries` is 0. Replay only
		 * idempotent Data API operations; never replay create/bulk/workflows.
		 */
		handler: async (error: Error, context?: ErrorContext) => {
			const retry = isIdempotent(context?.operation);
			return {
				maxRetries: retry ? 5 : 0,
				retryStrategy: retry ? ('exponential_backoff' as const) : undefined,
				headersRetryAfterMs:
					error instanceof BubbleAPIError ? error.retryAfter : undefined,
			};
		},
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
	 * **Never for a non-idempotent write.** `things.create`,
	 * `things.bulkCreate`, `workflows.run`, and `workflows.runGet` can mean
	 * the request never reached Bubble, or that it was processed and only
	 * the *response* was lost. Retrying the second case duplicates work.
	 */
	SERVER_ERROR: {
		match: (error: Error, context?: ErrorContext) => {
			if (!(error instanceof BubbleAPIError)) return false;
			if (error.status === undefined || error.status < 500) return false;
			if (isUnsafeWrite(context?.operation)) return false;
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
