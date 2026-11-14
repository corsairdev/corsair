import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

export const errorHandlers = {
	// The transport owns 429 retries via corsair/http's built-in rate-limit config,
	// so the plugin error handler returns maxRetries: 0 to prevent retry compounding.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('too many requests') ||
				msg.includes('too many attempts') ||
				msg.includes('rate_limited') ||
				msg.includes('rate limit') ||
				msg.includes('concurrency_limit') ||
				msg.includes('429')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			)
				return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('unauthenticated') ||
				msg.includes('invalid_auth') ||
				msg.includes('forbidden') ||
				msg.includes('invalid api key') ||
				msg.includes('permission')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('not found') || msg.includes('404');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	GONE_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 410) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('410') ||
				msg.includes('gone') ||
				msg.includes('retired') ||
				msg.includes('no longer available')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
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
				msg.includes('server error') ||
				msg.includes('internal error') ||
				msg.includes('500') ||
				msg.includes('502') ||
				msg.includes('503') ||
				msg.includes('service unavailable')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
