import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * A status suitable for a log line, never the error body. The provider's
 * error body (`{"errors":[{"code","detail","source"}]}`) can carry a
 * `source.pointer` naming a request field - logging the whole body risks
 * echoing back a value the caller sent (a domain, a profile name), so only
 * the status travels into logs.
 */
function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

export const errorHandlers = {
	/**
	 * No documented rate limit for this API, and no 429 has been observed
	 * live - handled defensively since it's a plausible status for any REST
	 * API, not because it's confirmed.
	 *
	 * `maxRetries: 0` is deliberate: `packages/corsair/core/endpoints/bind.ts`'s
	 * endpoint-level retry recurses on retry but discards the result, always
	 * rethrowing the original error even when the retry succeeds (confirmed
	 * during this repo's College Football Data review round - see that
	 * plugin's `error-handlers.ts` for the full analysis). The shared
	 * request layer's own transport retry (`corsair/http`'s `request()`,
	 * default `maxRetries: 3`, real loop, returns the successful result) is
	 * therefore the only retry path used here.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			console.warn(
				`[NEXTDNS:${context.operation}] Rate limited after transport retries exhausted (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	/** Not documented in the spec; expected in practice for a missing/bad key. */
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('unauthorized');
		},
		handler: async (error, context) => {
			console.warn(
				`[NEXTDNS:${context.operation}] Authentication failed - check the API key`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Confirmed live: a route this key isn't authorized for returns 403 (the
	 * account/session-only `/account` endpoint, not part of this catalog's
	 * surface, returned 403 rather than 404 when probed with a plain API
	 * key). Distinct from `AUTH_ERROR` (bad/missing key) - this is a key
	 * that authenticates fine but lacks permission for the specific call.
	 */
	PERMISSION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 403,
		handler: async (error, context) => {
			console.warn(
				`[NEXTDNS:${context.operation}] Forbidden (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	/** Confirmed live: a deleted/nonexistent profile (or child resource) returns 404. */
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[NEXTDNS:${context.operation}] Resource not found (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Confirmed live: an invalid field value (bad parental-control category
	 * id, malformed request) returns 400 with
	 * `{"errors":[{"code":"invalid","source":{"pointer":"/id"}}]}`.
	 */
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 400,
		handler: async (error, context) => {
			console.warn(
				`[NEXTDNS:${context.operation}] Invalid request (status ${safeStatus(error)})`,
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
		/**
		 * Unlike `RATE_LIMIT_ERROR`, the transport has no retry path for a
		 * plain network failure (its retry loop only fires for 429s - see
		 * `corsair/async-core/request.ts`). But the same `bind.ts`
		 * discard-on-retry bug applies here too, so a nonzero `maxRetries`
		 * would only spend extra requests against a non-idempotent write
		 * (this catalog has real POST/PUT/PATCH/DELETE operations, unlike a
		 * read-only API) for no benefit. `maxRetries: 0` fails fast instead
		 * of silently double-submitting a mutation.
		 */
		handler: async (error, context) => {
			console.warn(
				`[NEXTDNS:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[NEXTDNS:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
