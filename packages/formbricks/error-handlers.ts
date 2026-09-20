import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Formbricks reports failures with ordinary HTTP status codes, so most handlers match on the
 * status alone.
 *
 * The error envelopes differ by version, and both were observed live:
 *
 * ```json
 * // v1
 * {"code":"bad_request","message":"workspaceId must be provided","details":{}}
 * // v2
 * {"error":{"code":400,"message":"Bad Request","details":[{"field":"workspaceId","issue":"..."}]}}
 * ```
 *
 * v2's `details` is an **array of `{field, issue}`**, which is genuinely useful - it names the
 * offending field. v1's is an object, usually empty. {@link describeValidationFailure} reads
 * either.
 *
 * @see https://formbricks.com/docs
 */

/**
 * Operations a replay could duplicate or make worse.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry
 * (`packages/corsair/core/endpoints/bind.ts`), so a network failure raised *after* Formbricks
 * committed a write would apply it twice. Formbricks accepts no idempotency key.
 *
 * Membership is reasoned per group rather than by HTTP method:
 *
 * - **Creates** - names are not unique anywhere in this API, so a replay produces a second
 *   survey, response, action class, webhook, contact or attribute key rather than returning the
 *   first.
 * - **`contacts.uploadBulk`** - a replayed bulk upload duplicates every row in the batch.
 *
 * Absent deliberately, each for a stated reason:
 *
 * - **Deletes of a named resource** - repeating one is not a duplication risk, and the second
 *   attempt reports not-found, which the delete flow reads as confirmed absence.
 * - **Updates** - `PUT` on a named record is idempotent in effect: applying the same body twice
 *   leaves the same state.
 *
 * `endpoints.test.ts` asserts every member of this set against the routing table, so a name here
 * cannot drift away from - or outlive - the endpoint it describes.
 */
export const NON_IDEMPOTENT_OPERATIONS: ReadonlySet<string> = new Set([
	'surveys.create',
	'responses.create',
	'actionClasses.create',
	'webhooks.create',
	'contacts.create',
	'contacts.uploadBulk',
	// Sets attribute values over the client user route, which upserts by `userId` and creates the
	// contact when that id is new - so a failed call leaves the caller unable to tell whether a person
	// was created. Same route and same reasoning as `client.identifyUser`.
	'contacts.updateAttributes',
	'contactAttributeKeys.create',
	// The client-side creates. Named for the registry, not for the resource: an earlier draft of
	// this set said `displays.create` and `clientUsers.create`, which are not operations this
	// plugin registers - the drift test in `endpoints.test.ts` caught all of them on its first
	// run, which is the entire reason it exists.
	'client.createDisplay',
	'client.createUser',
	'client.identifyUser',
	// Reads a respondent's state over the **same upserting route** as `client.identifyUser`. Listed
	// for that reason rather than because a replay duplicates anything - it does not, the upsert is
	// keyed by `userId` - but because the same route cannot be retry-safe under one operation name and
	// not under another. A failed call leaves the caller unable to tell whether the contact was
	// created, which is the property this set actually records.
	'client.contactsState',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT_OPERATIONS.has(operation);

/**
 * Whether a message-based fallback should be consulted at all.
 *
 * Every handler below matches on an `ApiError` status first and falls back to sniffing the
 * message, for transport-level failures that never reach a status. That fallback must not apply
 * when a status **is** available, and the reason is specific:
 *
 * - Corsair takes the **first** matching handler in declaration order
 *   (`packages/corsair/core/errors/handler.ts`).
 * - `ApiError`'s message **embeds the response body** (`packages/corsair/async-core/request.ts`).
 *
 * So a retryable 500 whose body happened to contain "not found" would be claimed by
 * `NOT_FOUND_ERROR` and never retried, and the same trap exists for "unauthorized", "forbidden"
 * and network words. **Every** message-matching handler here is gated on this, `NETWORK_ERROR`
 * included - on the previous integration that one was missed while a comment claimed the class
 * was covered, so `endpoints.test.ts` now asserts the property directly rather than trusting the
 * claim.
 */
const hasNoStatus = (error: unknown): boolean => !(error instanceof ApiError);

/**
 * Whether a 404 means the record is gone.
 *
 * Formbricks has **one** 404 shape - no separate route-absent envelope - so a 404 cannot be
 * distinguished from a wrong path by its body. That is worth stating because
 * it makes the delete flow's tolerance slightly broader here: a delete against a mistyped path
 * would be read as "already absent" rather than as a bug.
 *
 * The mitigation is that paths are not constructed dynamically anywhere in this plugin - every one
 * is a literal in an endpoint file, asserted by a routing test - so a wrong path fails in CI
 * rather than at runtime.
 */
export const isResourceAbsent = (error: unknown): boolean =>
	error instanceof ApiError && error.status === 404;

/** Reads the offending field names out of either version's validation envelope. */
export const describeValidationFailure = (error: unknown): string => {
	if (!(error instanceof ApiError)) return '';
	const body = error.body as
		| {
				message?: string;
				error?: { message?: string; details?: unknown };
				details?: unknown;
		  }
		| undefined;

	// v2: details is an array of {field, issue}, which names what to fix.
	const details = body?.error?.details ?? body?.details;
	if (Array.isArray(details)) {
		const fields = details
			.map((d) => (d as { field?: string })?.field)
			.filter((f): f is string => typeof f === 'string');
		if (fields.length > 0) return ` Offending fields: ${fields.join(', ')}.`;
	}
	// v1: a plain message, e.g. "workspaceId must be provided".
	const message = body?.message ?? body?.error?.message;
	return typeof message === 'string' && message.length > 0 ? ` ${message}` : '';
};

export const errorHandlers = {
	/**
	 * Formbricks does not document a rate limit and returned no budget headers on any observed
	 * response, so a 429 is handled defensively rather than from a known policy. A rejected
	 * request was not applied, so replaying is always safe - this is the one handler that retries
	 * regardless of operation.
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
				`[FORMBRICKS:${context.operation}] Authentication failed - check the API key (Settings -> API Keys). Note that an organization-scoped key cannot reach workspace-scoped routes: verify its workspace permissions with GET /api/v2/me.`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 403 covers a key whose scope does not include the workspace. Distinguished from 401 because
	 * the fix differs: 401 is a bad key, 403 is a key without the right permission.
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
				`[FORMBRICKS:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return (
				hasNoStatus(error) && error.message.toLowerCase().includes('not found')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[FORMBRICKS:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 400 and 422 cover the validation family, and Formbricks leans on them heavily: **most
	 * writes require `workspaceId` in the body**, and omitting it is a 400 rather than anything
	 * more descriptive. The handler surfaces the offending field names, which v2 provides
	 * directly.
	 */
	VALIDATION_ERROR: {
		match: (error, context) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async (error, context) => {
			console.warn(
				`[FORMBRICKS:${context.operation}] Invalid request: ${error.message}${describeValidationFailure(error)}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A 5xx arrives as an `ApiError` with a status rather than as a transport failure, so without
	 * this handler it would fall through to `DEFAULT` and never be retried.
	 *
	 * One Formbricks 500 is **not** a transient fault and must not be retried into: `PUT
	 * v1/management/responses/{id}` answers 500 when `data` is absent from the body, where a
	 * sibling endpoint would answer 422. That is a server-side bug reporting a missing required
	 * field as a crash, and retrying it three times just repeats it. The input schema requires
	 * `data`, which turns it into a local validation error before a request is ever sent.
	 */
	SERVER_ERROR: {
		match: (error, context) =>
			error instanceof ApiError && error.status >= 500 && error.status < 600,
		handler: async (error, context) => {
			console.warn(
				`[FORMBRICKS:${context.operation}] Server error: ${error.message}`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	/**
	 * A transport failure, which by definition carries no HTTP status - if a status came back, the
	 * network worked. Gated on `hasNoStatus` like the others, which is the member that was missed
	 * on the previous integration.
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
				`[FORMBRICKS:${context.operation}] Network error: ${error.message}`,
			);
			// A transport failure says nothing about whether the server applied the request, so
			// only operations a replay cannot duplicate are retried.
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	DEFAULT: {
		match: (error, context) => true,
		handler: async (error, context) => {
			console.error(
				`[FORMBRICKS:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
