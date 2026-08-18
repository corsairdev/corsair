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
	 * The free tier's rate limit is undocumented — this reacts to a 429
	 * when it arrives rather than pacing against a budget the provider
	 * never states.
	 *
	 * `maxRetries: 0` here is deliberate, not a missing feature: `client.ts`'s
	 * `COLLEGE_FOOTBALL_DATA_RATE_LIMIT_CONFIG` already retries 429s at the
	 * transport layer (a real loop that returns the successful result). The
	 * shared endpoint-level retry path this handler could opt into
	 * (`packages/corsair/core/endpoints/bind.ts`) recurses but discards the
	 * retried result and always rethrows the original error - stacking it on
	 * top of the transport retry would risk up to 4x the requests against a
	 * metered monthly quota while never actually returning a recovered
	 * response to the caller. Reaching this handler at all means the
	 * transport already retried and still failed.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			console.warn(
				`[COLLEGEFOOTBALLDATA:${context.operation}] Rate limited after transport retries exhausted (status ${safeStatus(error)})`,
			);
			return { maxRetries: 0 };
		},
	},
	/** Not documented in the spec; expected in practice for a missing/bad key. */
	AUTH_ERROR: {
		match: (error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const message = error.message.toLowerCase();
			return message.includes('unauthorized') || message.includes('forbidden');
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
		 * failure would never risk a duplicate write - unlike every other
		 * plugin in this repo, no `isNonIdempotent` predicate would be needed
		 * here at all. But the shared endpoint-level retry path this
		 * `maxRetries` feeds (`packages/corsair/core/endpoints/bind.ts`)
		 * recurses on retry and then discards the result, always rethrowing
		 * the original error even when the retry succeeds - so returning a
		 * nonzero value here would only spend extra requests for a caller who
		 * still gets the same failure. `maxRetries: 0` fails fast and
		 * honestly instead.
		 */
		handler: async (_error, context) => {
			console.warn(`[COLLEGEFOOTBALLDATA:${context.operation}] Network error`);
			return { maxRetries: 0 };
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
