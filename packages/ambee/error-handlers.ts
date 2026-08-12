import type { CorsairErrorHandler } from 'corsair/core';
import type { AmbeeAPIError } from './client';

/**
 * Reads the HTTP status from an error. Works with `AmbeeAPIError` (which
 * copies status off the originating `ApiError`) and with any error exposing a
 * numeric `status`.
 */
function getStatus(error: Error): number | undefined {
	return (error as Partial<AmbeeAPIError>).status;
}

/** Reads the Retry-After value (in ms) from an error, when present. */
function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AmbeeAPIError>).retryAfter;
}

/** Matches a bare HTTP status code as a standalone token in a message. */
function messageHasCode(message: string, ...codes: number[]): boolean {
	return codes.some((code) => new RegExp(`\\b${code}\\b`).test(message));
}

/**
 * Error handlers for the Ambee plugin.
 *
 * Ambee status codes (shared across all of its products):
 * - 401/403: missing, invalid, or not-subscribed API key
 * - 404: no data available for the requested location
 * - 422: malformed or out-of-range parameters
 * - 429: per-minute or per-day request quota exceeded
 * - 5xx: upstream failure
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 429;
			const msg = error.message.toLowerCase();
			return messageHasCode(msg, 429) || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 401 || status === 403;
			const msg = error.message.toLowerCase();
			return (
				messageHasCode(msg, 401, 403) ||
				msg.includes('unauthorized') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => {
			console.error(
				'[AMBEE] Authentication failed — check that the API key is valid and ' +
					'that the account is subscribed to the requested product.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		// Ambee returns 404 when a location is outside a product's coverage
		// (e.g. wildfire risk outside North America) — retrying cannot help.
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 404;
			const msg = error.message.toLowerCase();
			return messageHasCode(msg, 404) || msg.includes('not found');
		},
		handler: async () => {
			console.warn(
				'[AMBEE] No data available for the requested location — it may be ' +
					'outside this product’s coverage area.',
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status === 400 || status === 422;
			const msg = error.message.toLowerCase();
			return messageHasCode(msg, 400, 422) || msg.includes('unprocessable');
		},
		handler: async () => {
			console.warn(
				'[AMBEE] Request rejected — a required parameter is missing or malformed.',
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined) return status >= 500;
			const msg = error.message.toLowerCase();
			return messageHasCode(msg, 500) || msg.includes('internal server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[AMBEE] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
