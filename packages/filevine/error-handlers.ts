import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error, _ctx) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate_limited') ||
				msg.includes('429') ||
				msg.includes('too many requests')
			);
		},
		handler: async (error: Error, _ctx) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error, _ctx) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid_auth') ||
				msg.includes('invalid token') ||
				msg.includes('token_revoked') ||
				msg.includes('token_expired') ||
				msg.includes('not_authed')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error, _ctx) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('forbidden') ||
				msg.includes('permission') ||
				msg.includes('insufficient') ||
				msg.includes('access_denied') ||
				msg.includes('missing_scope')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error, _ctx) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('not_found');
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error, _ctx) => {
			if (error instanceof ApiError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('validation') ||
				msg.includes('bad request') ||
				msg.includes('invalid')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error: Error, _ctx) => {
			const msg = error.message.toLowerCase();
			return (
				msg.includes('network') ||
				msg.includes('econnrefused') ||
				msg.includes('enotfound') ||
				msg.includes('etimedout') ||
				msg.includes('fetch failed')
			);
		},
		handler: async (_error: Error, _ctx) => ({ maxRetries: 3 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (_error: Error, _ctx) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
