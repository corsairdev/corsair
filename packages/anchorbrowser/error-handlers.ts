import type { CorsairErrorHandler } from 'corsair/core';
import { AnchorBrowserAPIError } from './client';

function getStatus(error: Error): number | undefined {
	if (error instanceof AnchorBrowserAPIError) {
		return error.status;
	}
	return undefined;
}

/**
 * Only GET requests are safe to replay. A 5xx can be returned after the server
 * already applied a mutation (a session started, a task deployed, a profile
 * deleted), so retrying a non-GET risks performing it twice. Anchor Browser
 * documents no idempotency key, so mutations are not retried.
 */
function isRetryableMethod(error: Error): boolean {
	if (!(error instanceof AnchorBrowserAPIError)) return false;
	return error.method === undefined || error.method === 'GET';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		// Safe to retry for any method: a 429 means the request was rejected
		// before it was applied.
		match: (error: Error) => getStatus(error) === 429,
		handler: async () => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('forbidden');
		},
		handler: async () => {
			console.error(
				'[ANCHORBROWSER] Authentication failed — check your Anchor Browser API key.',
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => getStatus(error) === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async (error: Error) => {
			if (!isRetryableMethod(error)) {
				return { maxRetries: 0 };
			}
			return {
				maxRetries: 2,
				retryStrategy: 'exponential_backoff' as const,
			};
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[ANCHORBROWSER] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
