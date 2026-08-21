import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { AlphaVantageApiError } from './client';

/**
 * Alpha Vantage returns HTTP 200 for every outcome, including failures, and
 * signals the failure with a key in the JSON body. `assertNoAlphaVantageError`
 * in the client turns those bodies into `AlphaVantageApiError` with an explicit
 * `kind`, so these handlers classify on that rather than on status codes or
 * substring matching.
 *
 * The `ApiError` branches below still matter: they catch genuine transport-level
 * failures (a gateway error from the CDN in front of the API, for example),
 * which do carry real status codes.
 */

function hasKind(
	error: Error,
	kind: AlphaVantageApiError['kind'],
): error is AlphaVantageApiError {
	return error instanceof AlphaVantageApiError && error.kind === kind;
}

export const errorHandlers = {
	/**
	 * Two distinct limits share this handler. The call-frequency limit arrives as
	 * a `Note` and clears within a minute, so it is worth retrying. The daily
	 * allowance (25 requests on the free tier) arrives as an `Information` and
	 * does not clear until the next day, so retrying it only wastes time — the
	 * retry budget is therefore deliberately small.
	 */
	RATE_LIMIT_ERROR: {
		match: (error, context) => {
			if (hasKind(error, 'rate_limit')) {
				return true;
			}
			if (error instanceof ApiError && error.status === 429) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('call frequency') ||
				errorMessage.includes('daily allowance') ||
				errorMessage.includes('too many requests')
			);
		},
		handler: async (error, context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				// A gateway can send Retry-After of minutes; don't stall the caller.
				retryAfterMs = Math.min(error.retryAfter, 5_000);
			}

			console.warn(
				`[ALPHAVANTAGE:${context.operation}] Rate limited: ${error.message}`,
			);

			return {
				maxRetries: 2,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * The free tier resolves a premium-only operation with an `Information` body
	 * rather than a 402 or 403. It is a plan limitation, not a bad request, and
	 * no amount of retrying changes the outcome.
	 */
	PERMISSION_ERROR: {
		match: (error, context) => {
			if (hasKind(error, 'premium')) {
				return true;
			}
			if (
				error instanceof ApiError &&
				(error.status === 402 || error.status === 403)
			) {
				return true;
			}
			return error.message.toLowerCase().includes('premium endpoint');
		},
		handler: async (error, context) => {
			console.warn(
				`[ALPHAVANTAGE:${context.operation}] This operation requires a paid Alpha Vantage plan: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Defensive only. An API key that Alpha Vantage does not recognise was
	 * observed to return live data rather than an authentication failure, so on
	 * the query endpoint there is in practice no auth-error path to match. The
	 * handler is kept so that a future change on the provider's side, or a
	 * transport-level 401, is still classified rather than falling through to
	 * DEFAULT.
	 */
	AUTH_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 401) {
				return true;
			}
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('invalid api key') ||
				errorMessage.includes('apikey is invalid')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ALPHAVANTAGE:${context.operation}] Authentication failed - check your API key (https://www.alphavantage.co/support/#api-key)`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * An unknown function name or a missing required parameter comes back as an
	 * `Error Message` body. This is a malformed call, not a missing resource, so
	 * it is classified as validation rather than not-found even though the
	 * provider's wording ("does not exist") reads like the latter.
	 */
	VALIDATION_ERROR: {
		match: (error, context) => {
			if (hasKind(error, 'invalid_request')) {
				return true;
			}
			return error instanceof ApiError && error.status === 400;
		},
		handler: async (error, context) => {
			console.warn(
				`[ALPHAVANTAGE:${context.operation}] Invalid request: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	/**
	 * Alpha Vantage does not report an unknown symbol as an error — it answers
	 * with a well-formed but empty envelope. The endpoint handlers detect that
	 * and raise an explicit not-found, which is what this matches.
	 */
	NOT_FOUND_ERROR: {
		match: (error, context) => {
			if (error instanceof ApiError && error.status === 404) {
				return true;
			}
			return error.message.toLowerCase().includes('returned no data for');
		},
		handler: async (error, context) => {
			console.warn(
				`[ALPHAVANTAGE:${context.operation}] No data: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
	NETWORK_ERROR: {
		match: (error, context) => {
			const errorMessage = error.message.toLowerCase();
			return (
				errorMessage.includes('network') ||
				errorMessage.includes('connection') ||
				errorMessage.includes('econnrefused') ||
				errorMessage.includes('enotfound') ||
				errorMessage.includes('etimedout') ||
				errorMessage.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[ALPHAVANTAGE:${context.operation}] Network error: ${error.message}`,
			);

			return {
				maxRetries: 3,
			};
		},
	},
	DEFAULT: {
		match: (error, context) => {
			return true;
		},
		handler: async (error, context) => {
			console.error(
				`[ALPHAVANTAGE:${context.operation}] Unhandled error: ${error.message}`,
			);

			return {
				maxRetries: 0,
			};
		},
	},
} satisfies CorsairErrorHandler;
