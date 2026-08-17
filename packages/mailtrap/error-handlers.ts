import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { MailtrapAccountIdMissingError } from './client';

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
	 * rate-limit headers to pace against proactively.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('rate limit');
		},
		handler: async (error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
		},
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
				`[MAILTRAP:${context.operation}] Permission denied: ${error.message}`,
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
				`[MAILTRAP:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 422,
		handler: async (error, context) => {
			console.warn(
				`[MAILTRAP:${context.operation}] Invalid request: ${error.message}`,
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
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[MAILTRAP:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
