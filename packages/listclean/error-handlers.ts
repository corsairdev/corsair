import type { CorsairErrorHandler } from 'corsair/core';
import { ListcleanAPIError } from './client';

// Listclean documents no rate limit; a live burst of 12 requests produced no
// 429. A 429 is still answered explicitly so it cannot fall to DEFAULT, and a
// Retry-After would override the backoff if Listclean ever sends one.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof ListcleanAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs:
				error instanceof ListcleanAPIError ? error.retryAfter : undefined,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401 covers both failure wordings: "No auth token provided" and "Invalid
	// token or token expired". A retry sends the same key.
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ListcleanAPIError && error.isAuthError,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input and 404 an unknown route or id (Listclean answers 404
	// with an HTML page). A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status =
				error instanceof ListcleanAPIError ? error.status : undefined;
			return error.name === 'ZodError' || status === 400 || status === 404;
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A request that got no answer: reset, DNS failure or timeout. It may not
	// have reached Listclean, but a billed verify may already have spent a
	// credit and a batch submit may already have started a job, so replay
	// follows the operation's replayable flag, not the method.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof ListcleanAPIError && error.transport,
		handler: async (error: Error) => {
			if (error instanceof ListcleanAPIError && error.replayable) {
				return {
					maxRetries: 2,
					retryStrategy: 'exponential_backoff' as const,
				};
			}
			return { maxRetries: 0 };
		},
	},
	// A 5xx may have been processed before it failed: verification and batch
	// submit are billed work, and delete is destructive, so only the reads
	// (replayable) go again.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof ListcleanAPIError && (error.status ?? 0) >= 500,
		handler: async (error: Error) => {
			if (error instanceof ListcleanAPIError && error.replayable) {
				return {
					maxRetries: 2,
					retryStrategy: 'exponential_backoff' as const,
				};
			}
			return { maxRetries: 0 };
		},
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
