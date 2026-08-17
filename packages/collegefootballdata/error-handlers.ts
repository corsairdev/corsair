import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * A status suitable for a log line, never the error body.
 *
 * The provider's OpenAPI document only declares `200`/`400`/`404` response
 * shapes for every operation - not `401`/`403`/`429`, which real requests
 * almost certainly still answer with (an API is vanishingly unlikely to
 * accept every request with no key at all). For any status the shared
 * `corsair/async-core/request.ts` error builder does not special-case, it
 * falls back to a message that embeds the full stringified response body.
 * Every operation in this catalog is a read against public sports data, so
 * the risk here is lower than a plugin with write bodies, but logging
 * status only is free and avoids re-learning this the hard way (see this
 * repo's Mailtrap plugin, where the same fallback path leaked full error
 * bodies through `VALIDATION_ERROR`).
 */
function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

export const errorHandlers = {
	/**
	 * The free tier's rate limit is undocumented (see `CFBD-PLAN.md` open
	 * question 5) - this reacts to a 429 when it arrives rather than pacing
	 * proactively against a budget the provider never states.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 3, headersRetryAfterMs: retryAfterMs };
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
				`[COLLEGEFOOTBALLDATA:${context.operation}] Authentication failed - check the API key`,
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
				`[COLLEGEFOOTBALLDATA:${context.operation}] Resource not found (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	/** `400` is documented in the spec - real, not a guess. */
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 400,
		handler: async (error, context) => {
			console.warn(
				`[COLLEGEFOOTBALLDATA:${context.operation}] Invalid request (status ${safeStatus(error)})`,
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
		 * Every operation in this catalog is a GET, so retrying a network
		 * failure never risks a duplicate write - unlike every other plugin in
		 * this repo, no `isNonIdempotent` predicate is needed here at all.
		 */
		handler: async (error, context) => {
			console.warn(
				`[COLLEGEFOOTBALLDATA:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[COLLEGEFOOTBALLDATA:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
