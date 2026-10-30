import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
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

	/**
	 * A 5xx is BigML's own infrastructure failing, not a bad request - worth a
	 * bounded retry, unlike every 4xx above.
	 *
	 * **Never for a create, and never without knowing which operation this
	 * is.** `projects.create` and `externalConnectors.create` are the only
	 * two `POST` (non-idempotent) operations in this plugin - a 5xx there can
	 * mean the request never reached BigML, or that it was processed and
	 * only the *response* was lost. Retrying the second case creates a real
	 * duplicate resource. `context.operation` is the exact `family.op`
	 * dot-path (confirmed from `corsair/core/endpoints/bind.ts`'s
	 * `operationPath` construction) and is always supplied by the real
	 * dispatch path; this fails closed (no retry) rather than open if that
	 * context is ever missing, since "unknown operation" cannot be proven
	 * safe to replay the way "confirmed GET/PUT/DELETE" can.
	 */
	SERVER_ERROR: {
		match: (error: Error, context?: ErrorContext) => {
			if (!(error instanceof BigmlAPIError)) return false;
			if (error.status === undefined || error.status < 500) return false;
			if (!context?.operation || context.operation.endsWith('.create')) {
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
