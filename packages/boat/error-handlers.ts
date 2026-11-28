import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { boatEndpointMeta } from './endpoints/catalog';
import { boatOperations } from './endpoints/manifest';

// Boat answers errors with a meaningful HTTP status and a body `{ ok: false, type, status, code, message, requestId }`: 400 bad input, 401 bad key, 402 billing required, 403 a plan limit or a key without the right scope (api_key_org_forbidden), 404, 409 a state conflict (sandbox_starting, machine_not_running), 413 a file above 5 MiB, 429 a start or concurrency limit, 502 sandbox_direct_failed, 503 no machine ready.
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
	boatOperations
		.filter(
			(operation) =>
				boatEndpointMeta[operation.id as keyof typeof boatEndpointMeta]
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
		// Boat documents no idempotency keys.
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
