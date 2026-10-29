import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { HabiticaHttpError } from './client';

/**
 * Habitica reports every failure through one envelope:
 *
 * ```json
 * {"success": false, "error": "TooManyRequests", "message": "..."}
 * ```
 *
 * The `error` field is a stable machine code, so the string fallbacks below
 * match Habitica's own vocabulary rather than the generic `rate_limited` /
 * `invalid_auth` spellings the scaffold assumes - which Habitica never sends.
 * The codes used here were all observed live on 2026-08-15:
 *
 * | status | `error`                                       |
 * | ------ | --------------------------------------------- |
 * | 400    | `BadRequest`                                  |
 * | 401    | `NotAuthorized`, `invalid_credentials`        |
 * | 404    | `NotFound`                                    |
 * | 429    | `TooManyRequests`                             |
 *
 * The status code is the primary signal; the message match only matters when an
 * error reaches here without having been wrapped as an `ApiError`.
 */
export const errorHandlers = {
	/**
	 * 30 requests per minute per user id, confirmed exactly: the 30th request in
	 * a burst was the one refused.
	 *
	 * Habitica sends `retry-after` in **fractional seconds** (`"21.069"`), which
	 * the two transports handle differently:
	 *
	 * - The shared transport parses it with `parseInt`, truncating to 21, so a
	 *   retry can fire a fraction of a second early and draw one further 429
	 *   before the backoff spaces attempts out. Expected, not a defect.
	 * - The raw-`fetch` paths parse it here in the plugin, keeping the fraction
	 *   and rounding up, so they never retry inside the window.
	 *
	 * See the rate-limit notes in `client.ts`.
	 *
	 * `maxRetries` is 5 rather than the transport's 3 because the limit is a
	 * fixed one-minute window: waiting is genuinely sufficient here, unlike a
	 * quota that will not reset for a day.
	 */
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			if (error instanceof HabiticaHttpError && error.status === 429)
				return true;
			const msg = error.message.toLowerCase();
			return msg.includes('toomanyrequests') || msg.includes('429');
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			// The four non-JSON operations bypass the shared transport and so
			// never produce an `ApiError`. Without this branch their 429s would
			// fall back to a blind exponential backoff against a fixed
			// one-minute window - the retries can all be spent before it resets.
			if (
				error instanceof HabiticaHttpError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},

	/**
	 * Authentication failures, which are never retried - the same credential
	 * will fail again.
	 *
	 * Worth knowing when diagnosing one: Habitica gives the **same** 401
	 * `invalid_credentials` / "There is no account that uses those credentials."
	 * for a wrong token *and* for a wrong user id. The two halves of the
	 * credential are not distinguishable from the response, so a failure here
	 * means "one of the two is wrong", not "the token is wrong".
	 *
	 * A missing header is different and says so: 401 `NotAuthorized` /
	 * "Missing authentication headers."
	 */
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			// Also covers an error that was rebuilt to strip a secret out of its
			// URL - see `withRedactedPathValue`. Without this the redaction would
			// silently downgrade a 401 to the DEFAULT handler.
			if (error instanceof HabiticaHttpError && error.status === 401) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('notauthorized') || msg.includes('invalid_credentials')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	/**
	 * A missing or empty `x-client` header, which Habitica answers **400
	 * BadRequest**, not 401 - even on routes that need no authentication.
	 *
	 * This is called out as its own handler because it is the failure most
	 * likely to be misread. The plugin always sends the header, so seeing this
	 * in practice points at the transport being bypassed rather than at the
	 * caller's input, and no retry will fix it.
	 */
	CLIENT_HEADER_ERROR: {
		match: (error: Error) =>
			error.message.toLowerCase().includes('missing x-client headers'),
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
