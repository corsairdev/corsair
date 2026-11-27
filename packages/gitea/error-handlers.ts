import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

// Gitea answers errors with a meaningful HTTP status (400 bad input, 401 bad
// or revoked token, 403 a missing scope or permission, 404 a missing record
// or, as plain text, a route the instance lacks, 405 a repository that is not
// in the state the call needs, 409 a conflict, 422 validation, 429 when the
// instance turns on rate limiting). The status is the signal; the message
// text is a fallback for an error that lost it.
function text(error: Error): string {
	return error.message.toLowerCase();
}

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

function isRead(error: Error): boolean {
	return error instanceof ApiError && error.request?.method === 'GET';
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 429;
			const msg = text(error);
			return msg.includes('too many requests') || msg.includes('rate limit');
		},
		// Core's request() has already retried this 429 (three times, honouring
		// Retry-After) before it reaches a handler. Retrying the endpoint again
		// would multiply the attempts.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 401 || code === 403;
			const msg = text(error);
			return msg.includes('unauthorized') || msg.includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined) return code === 404;
			return text(error).includes('not found');
		},
		// A record that was deleted: retrying won't bring it back.
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			if (code !== undefined)
				return (
					code === 400 ||
					code === 402 ||
					code === 405 ||
					code === 406 ||
					code === 409 ||
					code === 422
				);
			const msg = text(error);
			return msg.includes('bad request') || msg.includes('invalid input');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const code = status(error);
			return code !== undefined && code >= 500;
		},
		// Only reads are retried: a write (an issue created, a merge) may
		// already have happened, and Gitea has no idempotency keys.
		handler: async (error: Error) =>
			isRead(error)
				? { maxRetries: 2, retryStrategy: 'exponential_backoff' as const }
				: { maxRetries: 0 },
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
