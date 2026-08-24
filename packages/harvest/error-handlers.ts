import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HarvestAccountIdMissingError } from './client';

/**
 * Harvest reports failures with ordinary HTTP status codes, so almost every
 * handler below can match on the status alone.
 *
 * @see https://help.getharvest.com/api-v2/introduction/overview/general/
 */
/**
 * Whether replaying an operation could duplicate a record.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry, so a
 * network failure raised *after* Harvest committed a POST would raise a second
 * invoice, payment or expense. Harvest accepts no idempotency key, so the only
 * safe answer for those operations is not to retry at all — a caller that has
 * lost the response can list and check, whereas a duplicate invoice cannot be
 * un-sent.
 *
 * Every POST operation in the registry is named `create…` and no other operation
 * is; `endpoints.test.ts` asserts that against the routing table so the
 * predicate cannot drift away from the endpoints it describes.
 */
export const isNonIdempotent = (operation: string): boolean =>
	operation.toLowerCase().includes('create');

export const errorHandlers = {
	/**
	 * 100 requests per 15 seconds. Harvest sends `Retry-After` with the 429 and
	 * publishes no rate-limit headers on successful responses, so the header on
	 * the failure is the only scheduling information available.
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('too many requests') ||
				errorMessage.includes('throttle')
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
	 * A missing account id is a configuration fault rather than a transport
	 * failure, so it is matched first and never retried — every attempt would
	 * fail identically.
	 */
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof HarvestAccountIdMissingError) {
				return true;
			}
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			return error.message.toLowerCase().includes('authentication');
		},
		handler: async (error, context) => {
			console.warn(
				`[HARVEST:${context.operation}] Authentication failed - check the access token and account id (https://id.getharvest.com/developers)`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Harvest uses 403 for insufficient authorization. Several operations are
	 * administrator-only — creating users, updating company settings — and a
	 * token belonging to a regular member fails here rather than at 401.
	 */
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 403) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('forbidden') ||
				errorMessage.includes('insufficient')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[HARVEST:${context.operation}] Permission denied: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('not found') ||
				errorMessage.includes('does not exist')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[HARVEST:${context.operation}] Resource not found: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Harvest returns 422 for a well-formed request it cannot process — a
	 * deletion blocked by dependent records, a time entry on an archived
	 * project, an invoice item category still in use. The response body carries
	 * the reason, so it is surfaced rather than retried.
	 */
	VALIDATION_ERROR: {
		match: (error, context) => {
			return (
				error instanceof ApiError &&
				(error.status === 422 || error.status === 400)
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[HARVEST:${context.operation}] Invalid request: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Harvest documents 500 as a server error to retry after, not a client
	 * fault. DEFAULT would drop it with zero retries.
	 */
	SERVER_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status !== undefined) {
				return error.status >= 500;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('500') ||
				errorMessage.includes('internal server error')
			);
		},
		handler: async (_error, context) => ({
			maxRetries: isNonIdempotent(context.operation) ? 0 : 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
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
				`[HARVEST:${context.operation}] Network error: ${error.message}`,
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
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[HARVEST:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
