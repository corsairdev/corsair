import { ApiError } from 'corsair/http';
import type { CorsairErrorHandler } from 'corsair/core';

// Reply.io error conventions (docs: Errors use application/problem+json with a
// stable `code` in <resource>.<variant> format, e.g. "sequence.notFound"):
// - 401 Unauthorized with WWW-Authenticate: Bearer and an empty body.
// - 429 Too Many Requests with a Retry-After header (100 req/min,
//   3,000 req/hour per user).
// - 4xx business errors carry `code` slugs such as schedule.deleteRejected,
//   schedule.forbidden, sequenceContact.notInSequence, emailAccount.internalError.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('rate_limited') || message.includes('429');
		},
		handler: async (error, _context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') ||
				message.includes('invalid_auth') ||
				message.includes('www-authenticate')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('forbidden') ||
				message.includes('missing_scope') ||
				message.includes('permission_denied') ||
				message.includes('access_denied')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 404) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('notfound') ||
				message.includes('not_found') ||
				message.includes('not found')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error, _context) => {
			if (error instanceof ApiError && error.status === 400) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('bad request') ||
				message.includes('validation') ||
				message.includes('invalidinput') ||
				message.includes('invalid_input')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error, _context) => {
			if (
				error instanceof ApiError &&
				error.status >= 500 &&
				error.status <= 599
			)
				return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('internal_error') ||
				message.includes('internal server error') ||
				message.includes('bad gateway') ||
				message.includes('service unavailable')
			);
		},
		handler: async (_error, _context) => ({ maxRetries: 2 }),
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
