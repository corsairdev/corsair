import type { CorsairErrorHandler } from 'corsair/core';
import { BigmailerAPIError } from './client';

/**
 * BigMailer's own reference docs do not publish an error-body schema
 * anywhere this session could find (checked several `/reference/*.md`
 * pages) - so, unlike Doppler's confirmed `{"messages": [...], "success":
 * false}` envelope, every handler here classifies purely by HTTP status,
 * never by scanning a response body whose shape is undocumented and could
 * be anything.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmailerAPIError) return error.status === 429;
			return error.message.toLowerCase().includes('429');
		},
		/**
		 * BigMailer's docs state a hard 10 req/s, 4-concurrent cap with no
		 * documented `retry-after`-style header - honour one if the shared
		 * transport surfaced it anyway, otherwise fall back to a fixed backoff.
		 */
		handler: async (error: Error) => ({
			maxRetries: 5,
			headersRetryAfterMs:
				error instanceof BigmailerAPIError ? error.retryAfter : undefined,
		}),
	},

	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmailerAPIError) return error.status === 401;
			return error.message.toLowerCase().includes('401');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmailerAPIError) return error.status === 403;
			return error.message.toLowerCase().includes('403');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof BigmailerAPIError) return error.status === 404;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},

	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
