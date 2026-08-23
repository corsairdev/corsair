import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Status codes follow the official OpenAPI document, which documents 400, 403,
 * 404 and 422 across its operations, and Accredible's published rate-limit
 * guidance, which names 429 for throttling and 401 for an invalid API key.
 *
 * These handlers classify errors; they do not re-drive them. `corsair/http`
 * already retries 429 internally (`DEFAULT_RATE_LIMIT_CONFIG.maxRetries` is 3,
 * honouring `Retry-After`) and returns the attempt that succeeds, so asking the
 * binder for a second budget on top would multiply the two. `Retry-After` is
 * still surfaced so callers can pace themselves.
 */
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid api key')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	FORBIDDEN_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('forbidden') || msg.includes('permission denied');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 422)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('bad request') ||
				msg.includes('unprocessable') ||
				msg.includes('validation')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				error.status >= 500 &&
				error.status < 600
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('internal server') ||
				msg.includes('502') ||
				msg.includes('503')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
