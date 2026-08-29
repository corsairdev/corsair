import type { CorsairErrorHandler } from 'corsair/core';
import type { BreatheHRApiError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with BreatheHRApiError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<BreatheHRApiError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<BreatheHRApiError>).retryAfter;
}

/**
 * Extracts a searchable string from BreatheHR's JSON error body
 * (`{ error: { message, code, details } }`). Needed because the thrown
 * error's own `.message` can end up as the raw error *object* rather than a
 * string (corsair's request layer does `result.body?.message ||
 * result.body?.error || ...`, and BreatheHR nests everything under `error`,
 * so `.message` becomes that whole object, not text) — `.body` is preserved
 * untouched on `BreatheHRApiError` regardless, so it's the reliable source.
 */
function getErrorBodyText(error: Error): string {
	const body = (error as Partial<BreatheHRApiError>).body as
		| { error?: { message?: string; code?: string } }
		| undefined;
	return [body?.error?.message, body?.error?.code, error.message]
		.filter((part): part is string => typeof part === 'string')
		.join(' ')
		.toLowerCase();
}

/**
 * Error handlers for the BreatheHR plugin.
 *
 * BreatheHR API error codes (consistent across its product subdomains):
 * - 401: Invalid, missing, or unauthorized API key for the requested product
 * - 422: Verified against live keys — on Email Reputation specifically, a
 *   422 means the account's request quota is exhausted, not a malformed
 *   parameter (see QUOTA_ERROR below, checked before the generic
 *   VALIDATION_ERROR bucket). Other products may still return 422 for a
 *   genuinely malformed parameter.
 * - 429: Rate limit exceeded
 * - 5xx: Internal server error
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: getRetryAfter(error),
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid api key') ||
				msg.includes('unauthorized') ||
				msg.includes('401')
			);
		},
		handler: async () => {
			console.log(
				'[ABSTRACT] Authentication failed — check that the API key is valid ' +
					'for this specific BreatheHR product (each product has its own key).',
			);
			return { maxRetries: 0 };
		},
	},
	QUOTA_ERROR: {
		// Checked before VALIDATION_ERROR: on Email Reputation, BreatheHR
		// returns 422 (not 429) when the account's plan quota is exhausted,
		// confirmed against live keys. A generic 422 without quota wording
		// falls through to VALIDATION_ERROR below.
		match: (error: Error) => {
			if (getStatus(error) !== 422) return false;
			const text = getErrorBodyText(error);
			return (
				text.includes('quota') ||
				text.includes('exceeded') ||
				text.includes('limit reached')
			);
		},
		handler: async () => {
			console.warn(
				'[ABSTRACT] Request rejected — the plan/quota limit for this ' +
					'BreatheHR product has been exhausted, not a malformed request.',
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 422) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('422') || msg.includes('unprocessable');
		},
		handler: async () => {
			console.warn(
				'[ABSTRACT] Request rejected — a required parameter is missing or malformed.',
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('500') || msg.includes('internal server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[ABSTRACT] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
