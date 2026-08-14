import type { CorsairErrorHandler } from 'corsair/core';
import type { ClientaryAPIError } from './client';

/**
 * Helper to extract the HTTP status from an error.
 * Works with ClientaryAPIError (which copies status from ApiError)
 * and any error that exposes a numeric `status` property.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<ClientaryAPIError>).status;
}

/**
 * Helper to extract the Retry-After value (in ms) from an error.
 */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<ClientaryAPIError>).retryAfter;
}

/**
 * Error handlers for the Clientary plugin.
 *
 * Clientary returns reliable HTTP status codes:
 * - 401: invalid API credentials (Basic auth with `token:token`)
 * - 403: account lacks permission for the requested resource
 * - 404: resource not found
 * - 422: validation failure (missing/unique/conflicting fields)
 * - 426: request exceeds the account's current plan limits
 * - 429: rate limit exceeded (Retry-After header)
 * - 5xx: server error
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
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Authentication failed — check that the API token is ' +
					'valid and active for the account subdomain in use.',
			);
			return { maxRetries: 0 };
		},
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('403') || msg.includes('forbidden');
		},
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Request forbidden — the user behind the API token ' +
					'does not have permission for the requested resource.',
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
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Resource not found — the requested record does not ' +
					"exist or is outside the token user's scope.",
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
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Request rejected — a field is missing, malformed, ' +
					'or violates a uniqueness constraint (see the error body for ' +
					'the offending field).',
			);
			return { maxRetries: 0 };
		},
	},
	PLAN_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 426) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('426') || msg.includes('plan limit');
		},
		handler: async (error: Error) => {
			console.warn(
				'[CLIENTARY] Request rejected — the operation exceeds the ' +
					'current plan limits (e.g. record count). Upgrade the plan ' +
					'or reduce the request scope.',
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
		handler: async (error: Error) => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: (error: Error) => {
			void error;
			return true;
		},
		handler: async (error: Error) => {
			console.error(`[CLIENTARY] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
