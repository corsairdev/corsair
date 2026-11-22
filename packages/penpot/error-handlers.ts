import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Every route is a POST, so the operations that only read are named here;
 * they are safe to send again after a 5xx.
 */
const REPLAYABLE_OPERATIONS = new Set([
	'teams.list',
	'teams.get',
	'projects.listAll',
	'projects.get',
	'files.get',
	'files.snapshotsList',
	'comments.threadsList',
	'comments.threadGet',
	'comments.list',
	'webhooks.list',
	'accessTokens.list',
]);

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

// The client retries a 429 up to three times through core, honouring
// Retry-After. RATE_LIMIT_ERROR returns maxRetries 0 so a caller's root 429
// handler cannot restart those attempts (R8: one retry layer).
// Documented statuses (verified live): 401 authentication-required; 404
// unknown RPC name or resource.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// Only reads are replayed: creates and deletes have no documented
	// idempotency contract.
	SERVER_ERROR: {
		match: (error: Error, context?: ErrorContext) =>
			error instanceof ApiError &&
			error.status >= 500 &&
			REPLAYABLE_OPERATIONS.has(context?.operation ?? ''),
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

// Handlers match in key order and DEFAULT matches everything. Caller keys
// come first so a caller handler for a status no builtin covers can run at
// all, builtins the caller did not name follow, and DEFAULT stays last even
// when the caller adds or overrides handlers.
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
