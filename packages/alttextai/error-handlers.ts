import type { CorsairErrorHandler } from 'corsair/core';
import type { AltTextAiAPIError } from './client';

// CorsairErrorHandler receives a plain Error; duck-type AltText-specific fields
// without instanceof so handlers work across module boundaries.
function getStatus(error: Error): number | undefined {
	return (error as Partial<AltTextAiAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AltTextAiAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401 || getStatus(error) === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid api key');
		},
		handler: async () => {
			console.log('[ALTTEXT_AI] Authentication failed — check your X-API-Key.');
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
			console.warn('[ALTTEXT_AI] Resource not found.');
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status === 400 || status === 422;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[ALTTEXT_AI] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
