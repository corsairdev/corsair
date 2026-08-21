import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { LoyverseMirrorEvictionError } from './endpoints/persist';

/**
 * Loyverse reports failures with ordinary HTTP status codes and a consistent
 * `{"errors":[{"code","details","field"}]}` body, so almost every handler below
 * can match on the status alone.
 *
 * @see https://developer.loyverse.com/docs/
 */

/**
 * Operations a replay could duplicate.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry
 * (`packages/corsair/core/endpoints/bind.ts:206`), so a network failure raised
 * *after* Loyverse committed a write would apply it twice. Loyverse accepts no
 * idempotency key, so the only safe answer for those operations is not to retry.
 *
 * The `upsert` operations are the subtle case. Loyverse treats `POST /items`
 * and its siblings as an upsert: with an `id` in the body it updates in place,
 * without one it creates. A retry is therefore harmless in the first case and
 * duplicates a record in the second - and this predicate only sees the operation
 * name, not the body, so it cannot tell them apart. It reports every upsert as
 * unsafe, which costs a retry that would sometimes have been fine and never
 * creates a duplicate.
 *
 * Two absences are deliberate. Repeating a **delete** is not a duplication risk,
 * and the second attempt reports 404, which `NOT_FOUND_ERROR` already handles.
 * `inventory.update` looks like a write that should be here but is not: its body
 * carries `stock_after`, an absolute level rather than a delta, so applying it
 * twice leaves the same stock figure. Verified live - two identical calls with
 * `stock_after: 7` both left the level at 7.
 *
 * `endpoints.test.ts` asserts this set equals the POST operations in the routing
 * table minus `inventory.update`, so the predicate cannot drift away from the
 * endpoints it describes and the one exception cannot be widened by accident.
 */
const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'items.upsert',
	'items.uploadImage',
	'variants.upsert',
	'categories.upsert',
	'modifiers.upsert',
	'discounts.upsert',
	'taxes.upsert',
	'customers.upsert',
	'suppliers.upsert',
	'posDevices.upsert',
	'webhooks.upsert',
	'receipts.create',
	'receipts.refund',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT_OPERATIONS.has(operation);

export const errorHandlers = {
	/**
	 * Documented as 300 requests per 300 seconds per account.
	 *
	 * A rejected request was never applied, so replaying one is always safe -
	 * this is the one handler that retries regardless of the operation.
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('too many requests') ||
				errorMessage.includes('rate_limited')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}

			return {
				maxRetries: 3,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * 402 means the account's plan does not cover what was asked for. It carries
	 * two distinct meanings, so the message names both rather than guessing:
	 *
	 * - the subscription has lapsed, and
	 * - the request reached past a plan limit. Filtering receipts by date is the
	 *   case that actually occurs on a free account:
	 *   `Unable to retrieve receipts created earlier than 31 days ago. Please
	 *   subscribe to Unlimited sales history.` An unfiltered receipts list still
	 *   succeeds, so this is a limit on the query rather than a dead account.
	 *
	 * Either way it is a configuration fault rather than a transport failure, so
	 * it is matched before the generic handlers and never retried - no number of
	 * attempts changes what the plan includes. The response body carries the
	 * specific reason and is surfaced with the warning.
	 */
	SUBSCRIPTION_ERROR: {
		match: (error, context) =>
			error instanceof ApiError && error.status === 402,
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Payment required - the account's Loyverse plan does not cover this request (a lapsed subscription, or a plan limit such as sales history older than 31 days): ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('unauthorized') ||
				errorMessage.includes('access token is not valid')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Authentication failed - check the access token (https://r.loyverse.com/dashboard/#/integrations/tokens)`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Loyverse uses 403 for a token whose OAuth scopes do not cover the
	 * resource. A personal access token reaches everything, so this surfaces
	 * mainly for scoped OAuth tokens.
	 */
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('permissions')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * 404 covers an unknown id, and - for most resources - a soft-deleted one.
	 *
	 * That second case is **not uniform**, which is worth knowing before treating a
	 * 404 as proof a record never existed. After a delete, a direct read returns 404
	 * for items, modifiers, taxes, customers and POS devices, but 200 with
	 * `deleted_at` set for categories and suppliers. Every resource drops out of the
	 * plain list and reappears under `show_deleted=true`. Measured per resource
	 * rather than assumed.
	 */
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				errorMessage.includes('was not found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * 400 covers the whole validation family - INVALID_VALUE,
	 * MISSING_REQUIRED_PARAMETER, INVALID_CURSOR, CONFLICTING_PARAMETERS - and
	 * 415 an unsupported upload type. The body names the offending field, so it
	 * is surfaced rather than retried.
	 */
	VALIDATION_ERROR: {
		match: (error, context) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 415),
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Invalid request: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * A record was deleted at Loyverse but could not be removed from the local
	 * mirror.
	 *
	 * Never retried, and matched before the generic handlers so it cannot be read
	 * as a transport failure. Replaying the endpoint would re-issue a delete for a
	 * record that is already gone - a 404 - and would not address the actual
	 * problem, which is local. The message names both halves of the outcome.
	 */
	MIRROR_EVICTION_ERROR: {
		match: (error, context) => error instanceof LoyverseMirrorEvictionError,
		handler: async (error, context) => {
			console.error(`[LOYVERSE:${context.operation}] ${error.message}`);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * A 5xx from Loyverse.
	 *
	 * Retried only where a replay cannot duplicate anything, which is the same test
	 * the network handler applies: the server may or may not have applied a write
	 * before failing, and Loyverse accepts no idempotency key. Reads and deletes
	 * therefore get the retry, writes do not.
	 *
	 * This sits before `NETWORK_ERROR` because a 5xx arrives as an `ApiError` with a
	 * status, not as a transport failure, and would otherwise fall through to
	 * `DEFAULT` and never be retried at all. Loyverse does return 500 for at least
	 * one deterministic case - an item image below its minimum size - and retrying
	 * that is pointless but harmless, since `items.uploadImage` is non-idempotent
	 * and so gets no retry.
	 *
	 * `customers.delete` is worth singling out, because a 5xx there is genuinely
	 * ambiguous - Loyverse may have committed the delete before failing - and a
	 * repeated customer delete answers 404 rather than succeeding again. The retry is
	 * still correct, but only because the endpoint treats that 404 as confirmation
	 * that the record is absent and goes on to clear the mirror. Were it to surface
	 * the 404 instead, the replay would end in a not-found error having deleted the
	 * customer remotely and left their personal data cached. The safety of this retry
	 * lives in `endpoints/customers.ts`, not here; a handler cannot check remote state
	 * or reach the mirror, since it receives only the error, the operation name and
	 * the input.
	 */
	SERVER_ERROR: {
		match: (error, context) =>
			error instanceof ApiError && error.status >= 500 && error.status < 600,
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Server error ${error instanceof ApiError ? error.status : ''}: ${error.message}`,
			);

			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 3,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[LOYVERSE:${context.operation}] Network error: ${error.message}`,
			);

			// A transport failure says nothing about whether the server applied
			// the request, so only the operations a replay cannot duplicate are
			// retried.
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 3,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => true,
		handler: async (error, context) => {
			console.error(
				`[LOYVERSE:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
