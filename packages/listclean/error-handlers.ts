import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { requestFactsOf } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof ApiError ? error.status : undefined;
}

/** Two more tries for a replayable operation, none for the rest. */
function replayIfSafe(error: Error) {
	if (requestFactsOf(error)?.replayable) {
		return {
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		};
	}
	return { maxRetries: 0 };
}

export const errorHandlers = {
	// Core's request() already retried the 429 three times, honouring
	// Retry-After (Listclean documents no rate limit and sends no header), so
	// the handler does not retry again (PLUGIN_PR_RULES R8).
	RATE_LIMIT_ERROR: {
		match: (error: Error) => statusOf(error) === 429,
		handler: async (error: Error) => ({
			maxRetries: 0,
			headersRetryAfterMs:
				error instanceof ApiError ? error.retryAfter : undefined,
		}),
	},
	// 401 covers both failure wordings: "No auth token provided" and "Invalid
	// token or token expired". A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401 || statusOf(error) === 403,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 an unknown route or id (Listclean answers 404
	// with an HTML page). A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A request that got no answer: reset, DNS failure or timeout. It may have
	// reached Listclean, and a billed verify may already have spent a credit or
	// a batch submit started a job, so replay follows the operation's
	// replayable flag, not the method.
	TRANSPORT_ERROR: {
		match: (error: Error) => requestFactsOf(error)?.transport === true,
		handler: async (error: Error) => replayIfSafe(error),
	},
	// A 5xx may have been processed before it failed, so only replayable
	// operations (the reads and the idempotent profile update) go again.
	SERVER_ERROR: {
		match: (error: Error) => (statusOf(error) ?? 0) >= 500,
		handler: async (error: Error) => replayIfSafe(error),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers. Caller keys go
// first, so a caller handler for a status no builtin covers runs before the
// builtins can claim the error.
export function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const merged: CorsairErrorHandler = { ...userRest };
	for (const [name, entry] of Object.entries(builtinRest)) {
		if (!(name in merged)) merged[name] = entry;
	}
	const fallback = userDefault ?? builtinDefault;
	if (fallback) merged.DEFAULT = fallback;
	return merged;
}
