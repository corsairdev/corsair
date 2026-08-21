import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/** A status suitable for a log line, never the error body (which may echo back a caller's query). */
function safeStatus(error: Error): number | 'unknown' {
	return error instanceof ApiError ? error.status : 'unknown';
}

export const errorHandlers = {
	/**
	 * Not live-tested directly (would need to actually exhaust the free
	 * tier's rate limit to observe), but the account endpoint's own
	 * `account_rate_limit_per_hour` field confirms a real per-hour cap
	 * exists, so this is handled defensively.
	 *
	 * `maxRetries: 0` is deliberate: `packages/corsair/core/endpoints/bind.ts`'s
	 * endpoint-level retry recurses on retry but discards the result,
	 * always rethrowing the original error even when the retry succeeds
	 * (found and documented during this repo's College Football Data and
	 * NextDNS review rounds). `client.ts`'s transport uses the shared
	 * request layer's default rate-limit config, which already retries
	 * 429s in a real loop - reaching this handler means that already
	 * failed, so stacking a second retry here would only spend extra
	 * requests against a metered monthly quota for no benefit.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			console.warn(
				`[SERPAPI:${context.operation}] Rate limited after transport retries exhausted (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	/** Confirmed live: an invalid key 401s with `{"error":"Invalid API key. ..."}`. */
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			return error.message.toLowerCase().includes('invalid api key');
		},
		handler: async (error, context) => {
			console.warn(
				`[SERPAPI:${context.operation}] Authentication failed - check the API key`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Confirmed live: a missing/invalid required parameter (e.g. no `q`,
	 * an unsupported `engine`) 400s with `{"error":"Missing query \`x\`
	 * parameter."}` or similar - real and expected, not a guess.
	 */
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 400,
		handler: async (error, context) => {
			console.warn(
				`[SERPAPI:${context.operation}] Invalid request (status ${safeStatus(error)})`,
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
		 * failure would never risk a duplicate write. But the same shared
		 * endpoint-level retry-discard bug noted above applies here too, so
		 * a nonzero value would only spend extra requests against the
		 * metered monthly quota for no benefit.
		 */
		handler: async (error, context) => {
			console.warn(
				`[SERPAPI:${context.operation}] Network error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[SERPAPI:${context.operation}] Unhandled error (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
