import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { steelEndpointMeta } from './endpoints/catalog';
import { steelOperations } from './endpoints/manifest';

// Steel answers errors with a meaningful HTTP status (400 bad input, 401 bad key, 402 out of credit, 403, 404, 409, 429 over the plan's concurrency or rate limit) and a JSON body with `message` or `error`.
// The status is the signal; the message text is a fallback for an error that
// lost it.
function text(error: Error): string {
	return error.message.toLowerCase();
}

function status(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** Routes that only read, whatever their method (a search sent as POST). */
const READ_ROUTES = new Set(
	steelOperations
		.filter(
			(operation) =>
				steelEndpointMeta[operation.id as keyof typeof steelEndpointMeta]
					?.riskLevel === 'read',
		)
		.map((operation) => `${operation.method} ${operation.path}`),
);

function isRead(error: Error): boolean {
	if (!(error instanceof ApiError)) return false;
	const method = error.request?.method;
	if (method === 'GET') return true;
	return READ_ROUTES.has(`${method} ${error.request?.url}`);
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
					code === 413 ||
					code === 415 ||
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
		// Only reads are retried: a write may already have happened, and
		// Steel documents no idempotency keys.
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
