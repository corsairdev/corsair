import type { CorsairErrorHandler } from 'corsair/core';
import { Mem0APIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof Mem0APIError ? error.status : undefined;
}

// The POSTs that only read. A retry cannot change what they return beyond
// getting past a transient failure.
const READ_OPERATIONS = new Set(['memories.search', 'memories.list']);

function isReadOperation(operation: string | undefined): boolean {
	return operation !== undefined && READ_OPERATIONS.has(operation);
}

// Status codes: the responses each endpoint in https://docs.mem0.ai/api-reference
// declares, plus the mapping Mem0's own TypeScript SDK applies
// (mem0ai/src/common/exceptions.ts).
export const errorHandlers = {
	// 429. Mem0 does not document a limit or a Retry-After header, but passes
	// one through when it sends it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof Mem0APIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof Mem0APIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 and 403: a missing, wrong or revoked key, or a key without access to
	// the project. The SDK treats both as AuthenticationError. A retry sends
	// the same key.
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return status === 401 || status === 403;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400, 409 and 422: a rejected body or a missing entity ID in filters.
	// 409 also covers a write that collides with existing content, such as an
	// update whose text duplicates another memory, so a retry sends the same
	// request. 404 means an unknown memory or event.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 409 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// 413: the plan's add or retrieval quota is used up for the month. Waiting
	// will not help, and the limits reset on the billing date.
	QUOTA_ERROR: {
		match: (error: Error) => statusOf(error) === 413,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 5xx. Only reads are replayed: a failed add or delete may have gone
	// through, and deleteAll is queued rather than applied inline. search and
	// list are POSTs that read, so they retry with the GET reads.
	SERVER_ERROR: {
		match: (error: Error, context?: { operation?: string }) =>
			error instanceof Mem0APIError &&
			(error.status ?? 0) >= 500 &&
			(error.method === 'GET' || isReadOperation(context?.operation)),
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. User handlers come
// before builtin ones so a caller's rule is reached before an overlapping
// builtin match.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
