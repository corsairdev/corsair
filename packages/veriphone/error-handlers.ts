import type { CorsairErrorHandler } from 'corsair/core';
import type { VeriphoneAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with VeriphoneAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<VeriphoneAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<VeriphoneAPIError>).retryAfter;
}

/**
 * Error handlers for the Veriphone plugin.
 *
 * Veriphone error codes (https://veriphone.io/docs/v3, Error Responses):
 * - 400: invalid or missing input (incl. unsupported `mode`)
 * - 401: missing or invalid API key
 * - 402: insufficient credits
 * - 403: account inactive or access denied
 * - 404: resource not found
 * - 429: rate limited (standard Retry-After header)
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
			// maxRetries must be > 0 for headersRetryAfterMs to take effect:
			// the binder only waits headersRetryAfterMs when it actually
			// retries (packages/corsair/core/endpoints/bind.ts). Same shape
			// as the reference slack plugin's rate-limit handler.
			return {
				maxRetries: 5,
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
				msg.includes('api key or token required') ||
				msg.includes('401')
			);
		},
		handler: async () => {
			console.warn(
				'[VERIPHONE] Authentication failed — check that the API key is valid ' +
					'and active on your Veriphone account.',
			);
			return { maxRetries: 0 };
		},
	},
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 402) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('402') || msg.includes('insufficient credits');
		},
		handler: async () => {
			console.warn(
				'[VERIPHONE] Request rejected — insufficient credits. ' +
					'Top up the Veriphone account or reduce lookup volume.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('404') || msg.includes('not found');
		},
		handler: async () => {
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
		handler: async () => {
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[VERIPHONE] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
