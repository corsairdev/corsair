import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ReplyioAPIError } from './client';

// Reply.io error conventions (docs: Errors use application/problem+json with a
// stable `code` in <resource>.<variant> format, e.g. "sequence.notFound"):
// - 401 Unauthorized with WWW-Authenticate: Bearer and an empty body.
// - 429 Too Many Requests with a Retry-After header (100 req/min,
//   3,000 req/hour per user).
// - 4xx business errors carry `code` slugs such as schedule.deleteRejected,
//   schedule.forbidden, sequenceContact.notInSequence, emailAccount.internalError.
//
// Classification uses only structured fields (status / body.code) — never
// error.message text, which is unstable across transports.
function getStatus(error: Error): number | undefined {
	if (error instanceof ApiError) return error.status;
	if (error instanceof ReplyioAPIError) return error.status;
	return undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error, _context) => getStatus(error) === 429,
		handler: async (error, _context) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			} else if (
				error instanceof ReplyioAPIError &&
				error.retryAfter !== undefined
			) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error, _context) => getStatus(error) === 401,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error, _context) => getStatus(error) === 403,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error, _context) => getStatus(error) === 404,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error, _context) => getStatus(error) === 400,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error, _context) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500 && status <= 599;
		},
		handler: async (_error, _context) => ({ maxRetries: 2 }),
	},
	DEFAULT: {
		match: (_error, _context) => true,
		handler: async (_error, _context) => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
