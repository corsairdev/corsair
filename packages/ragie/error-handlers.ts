import type { CorsairErrorHandler } from 'corsair/core';
import { RagieAPIError } from './client';

function statusOf(error: Error): number | undefined {
	return error instanceof RagieAPIError ? error.status : undefined;
}

function retryAfterOf(error: Error): number | undefined {
	return error instanceof RagieAPIError ? error.retryAfter : undefined;
}

// Statuses from the SDK's per-operation error tables: 400, 401, 402, 404,
// 422, 429 and 500 all answer the `{ detail }` body. Ragie documents no
// rate-limit numbers and no idempotency keys, so writes are never replayed
// on a 5xx or a transport failure.
export const errorHandlers = {
	// 402: plan limit reached or payment required. Retrying cannot lift it.
	INSUFFICIENT_BALANCE_ERROR: {
		match: (error: Error) => statusOf(error) === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 429: "Too many requests". Ragie documents no window and no Retry-After
	// support (live behavior unverified), so fall back to exponential backoff
	// and let a real Retry-After header override it.
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			error instanceof RagieAPIError && error.isRateLimit,
		handler: async (error: Error) => ({
			maxRetries: 3,
			headersRetryAfterMs: retryAfterOf(error),
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// 401: a wrong or expired bearer token.
	AUTH_ERROR: {
		match: (error: Error) => statusOf(error) === 401,
		handler: async () => ({ maxRetries: 0 }),
	},
	// 400 invalid input, 404 missing id, 422 FastAPI validation (detail as an
	// array), or an input that failed zod here. A retry sends the same request.
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = statusOf(error);
			return (
				error.name === 'ZodError' ||
				status === 400 ||
				status === 404 ||
				status === 422
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	// A dropped connection never reached Ragie, so a replay-safe call can be
	// sent again. A write still lands on DEFAULT: the upload may have gone
	// through.
	TRANSPORT_ERROR: {
		match: (error: Error) =>
			error instanceof RagieAPIError && error.transport && error.replaySafe,
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	// Ragie's 500 bodies carry no transient marker, and no write here is
	// idempotent, so only replay-safe calls are retried. retrievals.retrieve
	// opts in: it is a single-shot search with no side effect, sent as a POST.
	SERVER_ERROR: {
		match: (error: Error) =>
			error instanceof RagieAPIError &&
			error.replaySafe &&
			(error.status ?? 0) >= 500,
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

// Core runs the first handler whose match passes, in key order, so the
// caller's keys must come before the builtins they replace and DEFAULT must
// stay last.
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
