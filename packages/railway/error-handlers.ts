import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isRailwayReadError, RailwayGraphQLError } from './client';

// Railway answers most failures with HTTP 200 and a GraphQL `errors` list;
// RailwayGraphQLError gives those a status from the message (403 "Not
// Authorized", 404 not found, 400 otherwise). Real HTTP errors are 400 for a
// document Railway can't parse, 401 for a bad token, 429 for the rate limit
// and 5xx. The status is the signal; the message text is a fallback.
function text(error: Error): string {
	return error.message.toLowerCase();
}

function status(error: Error): number | undefined {
	if (error instanceof ApiError || error instanceof RailwayGraphQLError) {
		return error.status;
	}
	return undefined;
}

// Every Railway call is a POST: a retry is safe only for a GraphQL query.
function isRead(error: Error): boolean {
	return isRailwayReadError(error);
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
		// Only queries are retried: a mutation (a deploy, a delete) may already
		// have happened, and Railway has no idempotency keys.
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
