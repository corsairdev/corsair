import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { MailtrapAccountIdMissingError } from './client';

/**
 * A status suitable for a log line, never the error body.
 *
 * Mailtrap's error bodies are shaped `{ errors: "..." }` or
 * `{ errors: { field: "..." } }` — not `message`/`error`/`detail`, the keys
 * `corsair/async-core/request.ts`'s shared error builder checks before
 * falling back to a generic message that embeds the full stringified
 * response body. That fallback triggers for any status the shared layer
 * does not special-case, which includes 422 — the status
 * `VALIDATION_ERROR` matches on — so `error.message` can carry whatever the
 * validation error echoed back (a submitted email, an invalid field value).
 * Handlers below log this instead of interpolating `error.message`.
 */
function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

/**
 * Whether replaying an operation could duplicate a record.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry, so
 * a network failure raised *after* Mailtrap committed a POST would create a
 * second contact, contact list, contact field, template, sending domain,
 * export or import job. None of these routes accept an idempotency key, so
 * the only safe answer is not to retry at all.
 *
 * `contacts.createEvent` is POST but excluded: Mailtrap models contact
 * events as an append-only stream with no id or dedupe key returned
 * (confirmed live — `POST .../contacts/{id}/events` echoes back
 * `contact_id`/`contact_email`/`name`/`params`, nothing identifying the
 * event itself), so replaying it is a duplicate log entry rather than a
 * duplicate *resource* — the same tolerance Corsair extends to logging-only
 * calls elsewhere.
 *
 * `endpoints.test.ts` asserts this predicate against the full routing table
 * so it cannot drift away from the operations it describes.
 */
export const isNonIdempotent = (operation: string): boolean =>
	[
		'contacts.create',
		'contacts.createExport',
		'contacts.import',
		'contactLists.create',
		'contactFields.create',
		'emailTemplates.create',
		'sendingDomains.create',
	].includes(operation);

export const errorHandlers = {
	/**
	 * A missing account id is a configuration fault rather than a transport
	 * failure, so it is matched first and never retried — every attempt would
	 * fail identically.
	 */
	CONFIGURATION_ERROR: {
		match: (error) => error instanceof MailtrapAccountIdMissingError,
		handler: async (error, context) => {
			console.warn(`[MAILTRAP:${context.operation}] ${error.message}`);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Mailtrap answers over-limit requests with a plain 429 and no documented
	 * rate-limit headers to pace against proactively. The transport already
	 * retries 429s with backoff (MAILTRAP_RATE_LIMIT_CONFIG), so don't retry
	 * again at the operation level — the two layers would multiply.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('rate limit');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[MAILTRAP:${context.operation}] Authentication failed - check the API token`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Also matched by operations that are correctly implemented but gated to
	 * a paid plan (e.g. `account.getPermissionResources`, confirmed live to
	 * 403 "Unavailable on your plan" on the free tier) — not retried either
	 * way, since a plan upgrade is the only thing that changes the outcome.
	 */
	PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async (error, context) => {
			console.warn(
				`[MAILTRAP:${context.operation}] Permission denied (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[MAILTRAP:${context.operation}] Resource not found (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 422,
		handler: async (error, context) => {
			console.warn(
				`[MAILTRAP:${context.operation}] Invalid request (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[MAILTRAP:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 3 };
		},
	},
	/**
	 * The catch-all for any status the handlers above do not classify — the
	 * same generic-fallback path that motivated `safeStatus` above, so it
	 * gets the same treatment.
	 */
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[MAILTRAP:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
