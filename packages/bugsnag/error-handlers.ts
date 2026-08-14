import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * BugSnag reports failures with ordinary HTTP status codes, so most handlers can
 * match on the status alone.
 *
 * It uses **two different error envelopes**, and both were observed live:
 *
 * ```json
 * {"errors":["release_stage_name can't be blank"]}   // 400, array of strings
 * {"status":404,"error":"Not Found"}                  // 404, single string
 * ```
 *
 * The two 404 shapes carry **different meanings**, which matters before treating a
 * 404 as "no such record":
 *
 * - `{"status":404,"error":"Not Found"}` - the route does not exist.
 * - `{"errors":["Event data deletion not found"]}` - the route exists and the
 *   resource does not.
 *
 * The distinction was used during recon to map the GDPR endpoints, and it is worth
 * preserving in the message so an operator can tell a wrong path from a missing
 * record.
 *
 * @see https://docs.bugsnag.com/api/data-access/
 */

/**
 * Operations a replay could duplicate or make worse.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry
 * (`packages/corsair/core/endpoints/bind.ts:206`), so a network failure raised
 * *after* BugSnag committed a write would apply it twice. BugSnag accepts no
 * idempotency key.
 *
 * Creates are here for the obvious reason. The GDPR operations are here for a
 * stronger one: replaying a data deletion, or a confirmation of one, acts on real
 * user data and cannot be undone. `regenerateApiKey` is here because a second
 * rotation would invalidate the key issued by the first, compounding the breakage.
 *
 * Deletes of a *named* resource are absent deliberately: repeating one is not a
 * duplication risk and the second attempt reports not-found, which
 * `NOT_FOUND_ERROR` already handles.
 *
 * `endpoints.test.ts` asserts this set against the routing table so the predicate
 * cannot drift away from the endpoints it describes.
 */
const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'projects.create',
	'projects.regenerateApiKey',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT_OPERATIONS.has(operation);

/** Whether a 404 body says the route is missing rather than the resource. */
export const isRouteMissing = (error: Error): boolean => {
	if (!(error instanceof ApiError)) return false;
	const body = error.body as { status?: number; error?: string } | undefined;
	return body?.status === 404 && body?.error === 'Not Found';
};

export const errorHandlers = {
	/**
	 * BugSnag publishes its budget on every successful response, so a well-behaved
	 * caller should rarely reach this. When it does, the request was rejected rather
	 * than applied, so replaying is always safe - this is the one handler that
	 * retries regardless of operation.
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[BUGSNAG:${context.operation}] Authentication failed - check the personal auth token (Settings -> My Account -> Personal Auth Tokens)`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 403 covers a token whose owner lacks the role for the operation. Several
	 * operations are admin-only - deleting an organization, managing collaborators -
	 * and a member's token fails here rather than at 401.
	 */
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				`[BUGSNAG:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Never retried, and the message distinguishes the two meanings rather than
	 * reporting both as "not found" - a wrong path and a missing record need
	 * different fixes.
	 */
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error, context) => {
			if (isRouteMissing(error)) {
				console.warn(
					`[BUGSNAG:${context.operation}] The API has no route at this path. On this API that usually means the feature is not available to the account's plan rather than that the record is missing: ${error.message}`,
				);
			} else {
				console.warn(
					`[BUGSNAG:${context.operation}] Resource not found: ${error.message}`,
				);
			}
			return { maxRetries: 0 };
		},
	},
	/**
	 * 400 and 422 cover the validation family. Several BugSnag endpoints require a
	 * parameter that is easy to omit - `release_stage_name` on release groups and
	 * feature flags, `buckets_count` or `resolution` on the trend endpoints - and
	 * answer 400 rather than applying a default. The body names the problem, so it
	 * is surfaced rather than retried.
	 */
	VALIDATION_ERROR: {
		match: (error, context) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async (error, context) => {
			console.warn(
				`[BUGSNAG:${context.operation}] Invalid request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A 5xx arrives as an `ApiError` with a status rather than as a transport
	 * failure, so without this handler it would fall through to `DEFAULT` and never
	 * be retried. Retried only where a replay cannot duplicate anything - the same
	 * test the network handler applies, since the server may or may not have applied
	 * a write before failing.
	 */
	SERVER_ERROR: {
		match: (error, context) =>
			error instanceof ApiError && error.status >= 500 && error.status < 600,
		handler: async (error, context) => {
			console.warn(
				`[BUGSNAG:${context.operation}] Server error: ${error.message}`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	NETWORK_ERROR: {
		match: (error, context) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('connection') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BUGSNAG:${context.operation}] Network error: ${error.message}`,
			);
			// A transport failure says nothing about whether the server applied the
			// request, so only the operations a replay cannot duplicate are retried.
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	DEFAULT: {
		match: (error, context) => true,
		handler: async (error, context) => {
			console.error(
				`[BUGSNAG:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
