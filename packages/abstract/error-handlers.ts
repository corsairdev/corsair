import type { CorsairErrorHandler } from 'corsair/core';
import type { AbstractAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with AbstractAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<AbstractAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AbstractAPIError>).retryAfter;
}

/**
 * Error handlers for the Abstract plugin.
 *
 * Abstract API error codes (consistent across its product subdomains):
 * - 401: Invalid, missing, or unauthorized API key for the requested product
 * - 422: Request is missing a required parameter or a parameter is malformed
 *   (e.g. an unparseable email/IBAN or unknown country code)
 * - 429: Rate limit or monthly quota exceeded for the plan
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
					'for this specific Abstract product (each product has its own key).',
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
