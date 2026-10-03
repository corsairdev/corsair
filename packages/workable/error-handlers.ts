import type { CorsairErrorHandler } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Corsair replays the whole endpoint call on retry. Workable has no
 * idempotency-key header, so a transport failure on a write cannot be told
 * apart from "the write already landed" - these are never retried after one.
 *
 * Names are the dotted operation paths Corsair passes as `context.operation`
 * (e.g. `departments.create`), matching `bindEndpointsRecursively`'s
 * `[...currentPath, key].join('.')` format.
 */
export const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'departments.create',
	'departments.update',
	'departments.merge',
	'departments.delete',
	'employees.create',
	'employees.update',
	'employees.uploadDocuments',
	'members.invite',
	'members.update',
	'members.enable',
	'subscriptions.create',
	'subscriptions.delete',
]);

/** Reports whether the dotted operation path is a non-idempotent write. */
function isNonIdempotent(operation: string): boolean {
	return NON_IDEMPOTENT_OPERATIONS.has(operation);
}

export const errorHandlers = {
	CONFIGURATION_ERROR: {
		match: (error) => {
			if (error instanceof AuthMissingError) return true;
			// why safe: narrows the union to read the optional `code` our own
			// client sets (MISSING_ACCESS_TOKEN / MISSING_ACCOUNT / INVALID_ACCOUNT).
			const code = (error as { code?: string }).code;
			return (
				code === 'MISSING_ACCESS_TOKEN' ||
				code === 'MISSING_ACCOUNT' ||
				code === 'INVALID_ACCOUNT'
			);
		},
		handler: async (error, context) => {
			console.error(
				`[WORKABLE:${context.operation}] Configuration error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/** Not publicly documented by Workable; retry generously on 429. */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('too many requests') || message.includes('rate limit')
			);
		},
		handler: async (error, context) => {
			// A throttled write is still a write: Workable offers no idempotency
			// key, so a replayed create/invite could land twice. Fail fast and
			// let the caller retry explicitly instead.
			if (isNonIdempotent(context.operation)) {
				console.warn(
					`[WORKABLE:${context.operation}] Rate limited on a write operation - not retried, since Workable offers no idempotency key: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[WORKABLE:${context.operation}] Authentication failed - check the access token generated under Settings > Integrations`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 403,
		handler: async (error, context) => {
			console.warn(
				`[WORKABLE:${context.operation}] Permission denied - the access token is likely missing a required scope: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 404,
		handler: async (error, context) => {
			console.warn(
				`[WORKABLE:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async (error, context) => {
			console.warn(
				`[WORKABLE:${context.operation}] Invalid request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('connection') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed') ||
				message.includes('aborted')
			);
		},
		handler: async (error, context) => {
			if (isNonIdempotent(context.operation)) {
				console.warn(
					`[WORKABLE:${context.operation}] Network error on a write operation - not retried, since Workable offers no idempotency key: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
			console.warn(
				`[WORKABLE:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[WORKABLE:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
