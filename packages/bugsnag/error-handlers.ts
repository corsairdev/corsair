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
 * idempotency key, so there is nothing to make a replay safe.
 *
 * The membership is reasoned per group rather than by HTTP method:
 *
 * - **Creates**, for the obvious reason: names are not unique anywhere in this API, so a
 *   replay produces a second team, project, saved search or event field rather than
 *   returning the first.
 * - **`projects.regenerateApiKey`**, because a second rotation invalidates the key the
 *   first one issued, compounding the breakage instead of repeating it harmlessly.
 * - **`errors.bulkUpdate`**, because it reapplies an operation - possibly `delete` - to
 *   an entire batch.
 * - **The GDPR operations**, for the strongest reason: a replayed export starts a second
 *   gathering of an identified person's data, and a replayed deletion or confirmation
 *   acts irreversibly on real user data. A replay there is probably harmless, and
 *   "probably" is not a good enough basis for repeating it automatically.
 *
 * Absent deliberately, each for a stated reason rather than by omission:
 *
 * - **Deletes of a named resource** - repeating one is not a duplication risk, and the
 *   second attempt reports not-found, which `NOT_FOUND_ERROR` already handles.
 * - **`collaborators.invite`** - a POST, but re-inviting an address that already has
 *   access returns the existing collaborator rather than creating a second one.
 * - **`integrations.test`** - a POST that validates without creating anything.
 * - **`teams.addMembers` and `teams.addCollaboratorMemberships`** - adding an existing
 *   member again leaves the same membership, so a replay converges.
 *
 * `endpoints.test.ts` asserts every member of this set against the routing table, so a
 * name here cannot drift away from - or outlive - the endpoint it describes.
 */
export const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'projects.create',
	'projects.regenerateApiKey',
	'teams.create',
	'eventFields.create',
	'savedSearches.create',
	'integrations.configure',
	'errors.bulkUpdate',
	'errors.deleteAll',
	'dataRequests.createForOrganization',
	'dataRequests.createForProject',
	'dataDeletions.createForOrganization',
	'dataDeletions.createForProject',
	'dataDeletions.confirmForProject',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT_OPERATIONS.has(operation);

/**
 * Whether a 404 body says the route is missing rather than the resource.
 *
 * Takes `unknown` rather than `Error` because the honest input is whatever a `catch` block
 * received, and the `instanceof` check below is what narrows it. `Error` is assignable to
 * `unknown`, so the handlers that pass a typed error still work - and a caller in a catch
 * no longer needs a cast, which would have hidden the question of whether the value really
 * is an Error.
 */
export const isRouteMissing = (error: unknown): boolean => {
	if (!(error instanceof ApiError)) return false;
	const body = error.body as { status?: number; error?: string } | undefined;
	return body?.status === 404 && body?.error === 'Not Found';
};

/**
 * Whether a 404 says the **resource** is absent, as opposed to the route being wrong.
 *
 * The counterpart to {@link isRouteMissing}, and it lives beside it because they are the
 * same classification read in opposite directions - splitting them across files would
 * invite a reader to wonder whether they agree.
 *
 * Used by the delete flow to decide that a record is genuinely gone. A route-missing 404
 * returns `false` on purpose: that is a defect in the request rather than evidence anything
 * was deleted, and reporting it as a successful deletion would be a lie that also strands
 * the local mirror. See `endpoints/delete-flow.ts`.
 */
export const isResourceAbsent = (error: unknown): boolean =>
	error instanceof ApiError && error.status === 404 && !isRouteMissing(error);

/**
 * BugSnag's code for "that offset is too deep to answer".
 *
 * Mapped live on the error list: offsets past the end return an empty array, but an
 * offset beyond roughly a thousand returns 422 with this code. The two mean different
 * things to a caller paging by offset - an empty page says stop, a 422 says the request
 * cannot be served at all - so reporting it as an ordinary validation failure would send
 * an operator looking for a malformed request instead of a paging depth limit.
 */
const PAGINATION_LIMIT_CODE = 60000;

/** Whether a 422 says the requested page is too deep rather than the input malformed. */
export const isPaginationLimit = (error: unknown): boolean => {
	if (!(error instanceof ApiError)) return false;
	if (error.status !== 422) return false;
	const body = error.body as { code?: number } | undefined;
	return body?.code === PAGINATION_LIMIT_CODE;
};

/**
 * Whether a message-based fallback should even be consulted.
 *
 * Every handler below matches on an `ApiError` status first and falls back to sniffing the
 * message, for transport-level failures that never reach a status. That fallback must not
 * apply when a status **is** available, and the reason is specific rather than theoretical:
 *
 * - Corsair takes the **first** matching handler in declaration order
 *   (`packages/corsair/core/errors/handler.ts:41`), and `NOT_FOUND_ERROR` is declared
 *   before `SERVER_ERROR`.
 * - `ApiError`'s message **embeds the response body**
 *   (`packages/corsair/async-core/request.ts:323`).
 *
 * So a retryable 500 whose body happened to contain the words "not found" would be claimed
 * by `NOT_FOUND_ERROR` and never retried - and the same trap exists for a 500 mentioning
 * "unauthorized", "forbidden" or "too many requests".
 *
 * **Every** message-matching handler is gated on this: `RATE_LIMIT_ERROR`, `AUTH_ERROR`,
 * `PERMISSION_ERROR`, `NOT_FOUND_ERROR` and `NETWORK_ERROR`. The last of those was missed
 * when the others were fixed, and the earlier version of this comment claimed the class was
 * covered while it was not - so `endpoints.test.ts` now asserts the property directly
 * rather than trusting the claim: no `ApiError` bearing a status may be matched by a
 * handler on the strength of its message alone.
 */
const hasNoStatus = (error: Error): boolean => !(error instanceof ApiError);

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
			return (
				hasNoStatus(error) &&
				error.message.toLowerCase().includes('too many requests')
			);
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
			return (
				hasNoStatus(error) &&
				error.message.toLowerCase().includes('unauthorized')
			);
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
			return (
				hasNoStatus(error) && error.message.toLowerCase().includes('forbidden')
			);
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
			return (
				hasNoStatus(error) && error.message.toLowerCase().includes('not found')
			);
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
			if (isPaginationLimit(error)) {
				// Distinguished from an ordinary 422 because the fix is different: the
				// request is well formed, the page is simply too deep to serve. Retrying
				// is pointless and the operator needs to narrow the query rather than
				// correct it.
				console.warn(
					`[BUGSNAG:${context.operation}] The requested page is too deep for this API to answer. Offsets past roughly a thousand rows are refused; narrow the result set with filters instead. Note that the suggested 'sort=unsorted' cannot be combined with an offset: ${error.message}`,
				);
				return { maxRetries: 0 };
			}
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
	/**
	 * A transport failure, which by definition carries no HTTP status - if a status came
	 * back, the network worked.
	 *
	 * So this is gated on `hasNoStatus` like the others. It was the one member of the
	 * class left ungated when the rest were fixed, and it matches on message alone, which
	 * makes it the widest of them: it is declared after `VALIDATION_ERROR` and
	 * `SERVER_ERROR`, so the common statuses are already claimed, but an `ApiError` with a
	 * status none of them handles - a 402, 405 or 409 whose body happened to mention
	 * "connection" - would have been treated as a transport failure and **retried**.
	 * Retrying a 402 is pointless, and the comment above claimed the whole class was
	 * covered while this one was not.
	 */
	NETWORK_ERROR: {
		match: (error, context) => {
			if (!hasNoStatus(error)) return false;
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
