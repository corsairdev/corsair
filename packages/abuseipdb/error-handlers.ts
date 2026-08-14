import type { CorsairErrorHandler } from 'corsair/core';
import type { AbuseIPDBAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with AbuseIPDBAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<AbuseIPDBAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AbuseIPDBAPIError>).retryAfter;
}

/**
 * Extracts a searchable string from AbuseIPDB's JSON:API error body
 * (`{ "errors": [{ "detail", "status", "source" }] }`). The thrown error's
 * own `.message` can end up as the raw error *object* rather than a string
 * (corsair's request layer falls back to `result.body?.detail`, which is
 * undefined for AbuseIPDB's nested `errors[].detail` shape), so `.body` —
 * preserved untouched on `AbuseIPDBAPIError` — is the reliable source.
 */
function getErrorBodyText(error: Error): string {
	const body = (error as Partial<AbuseIPDBAPIError>).body as
		| { errors?: Array<{ detail?: string; status?: number }> }
		| undefined;
	const details = (body?.errors ?? [])
		.map((e) => e.detail)
		.filter((d): d is string => typeof d === 'string');
	return [details.join(' '), error.message].join(' ').toLowerCase();
}

/**
 * Error handlers for the AbuseIPDB plugin.
 *
 * AbuseIPDB returns reliable HTTP status codes:
 * - 401: invalid, missing, or unauthorized API key
 * - 402: plan tier limit exceeded (e.g. check-block network too large)
 * - 422: malformed/out-of-range parameter (e.g. maxAgeInDays > 365)
 * - 429: daily per-endpoint rate limit exceeded (Retry-After header)
 * - 5xx: internal server error
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
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('401')
			);
		},
		handler: async () => {
			console.warn(
				'[ABUSEIPDB] Authentication failed — check that the API key is valid ' +
					'and active on your AbuseIPDB account.',
			);
			return { maxRetries: 0 };
		},
	},
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 402) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('402') || msg.includes('payment required');
		},
		handler: async () => {
			console.warn(
				'[ABUSEIPDB] Request rejected — the parameter exceeds your current ' +
					'plan tier (e.g. check-block network too large). Upgrade the plan ' +
					'or narrow the request.',
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
				'[ABUSEIPDB] Request rejected — a parameter is missing, malformed, ' +
					'or out of range (see the error detail for the offending field).',
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
			console.error(`[ABUSEIPDB] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
